package com.donkie.quickcart.uploads.application.service;

import com.donkie.quickcart.shared.exception.handler.SafeExecutor;
import com.donkie.quickcart.uploads.api.dto.ContentType;
import com.donkie.quickcart.uploads.api.dto.DownloadFile;
import com.donkie.quickcart.uploads.application.exception.ImageNotFoundByIdException;
import com.donkie.quickcart.uploads.application.exception.ObjectNotFoundInS3Exception;
import com.donkie.quickcart.uploads.application.model.ObjectHead;
import com.donkie.quickcart.uploads.application.model.UploadResult;
import com.donkie.quickcart.uploads.domain.model.ImageFile;
import com.donkie.quickcart.uploads.domain.model.UploadStatus;
import com.donkie.quickcart.uploads.domain.repository.ImageFileRepo;
import com.donkie.quickcart.uploads.infra.integration.config.AwsProperties;
import com.donkie.quickcart.uploads.infra.integration.s3.S3Service;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class ImageUploadService {

    private final S3Service s3Service;
    private final ImageFileRepo imageFileRepo;
    private final AwsProperties awsProperties;

    @Transactional
    public UploadResult.PresignedUpload upload(ContentType contentType, String differentiatorName) {
        log.debug("Attempting image upload for differentiator: {}", differentiatorName);

        var uploadWindow = awsProperties.getS3().getPresign().getUploadTtl();
        ImageFile file = ImageFile.create(contentType.value(), differentiatorName, uploadWindow);
        imageFileRepo.save(file);

        log.debug("ImageFile recorded in DB. Generating presigned PUT URL with objectKey: {}", file.getObjectKey());
        URL url = s3Service.generatePresignedPutUrl(contentType, file.getObjectKey(), uploadWindow);

        log.debug("PresignedUpload PUT URL generated successfully.");
        return new UploadResult.PresignedUpload(file.getObjectKey(), url, uploadWindow);
    }

    @Transactional
    public UploadResult.Summary markUploadAsCompleted(String differentiatorName, String objectKey) {
        log.debug("Attempting to mark upload as completed for differentiator: {} and objectKey: {}", differentiatorName, objectKey);

        ObjectHead head = getObjectHead(objectKey);

        if (!head.isPresent()) {
            log.warn("Object not found in S3 for differentiator: {} and objectKey: {}", differentiatorName, objectKey);
            throw new ObjectNotFoundInS3Exception(HttpStatus.NOT_FOUND,
                    "No Object/file uploaded with the given key");
        }

        var imageFile = imageFileRepo.findByObjectKey(objectKey)
                .map(r -> {
                    r.uploadCompleted();
                    var res = imageFileRepo.save(r);
                    log.info("Upload completed successfully. ObjectKey: {}", r.getObjectKey());
                    return res;
                })
                .orElseGet(() -> {
                    log.warn("Image not found in DB for differentiator: {} and objectKey: {}. Creating record for sync.",
                            differentiatorName, objectKey);
                    ImageFile newFile = ImageFile.create(head.contentType(), differentiatorName, Duration.ofMinutes(1));
                    newFile.setObjectKey(objectKey);
                    newFile.uploadCompleted();
                    var res = imageFileRepo.save(newFile);
                    log.info("Synchronized missing image record for objectKey: {}", newFile.getObjectKey());
                    return res;
                });

        return new UploadResult.Summary(true, imageFile);
    }

    @Transactional(readOnly = true)
    public UploadResult.PresignedDownload getPresignedDownloadUrl(UUID imageId) {
        log.debug("Generating presigned GET URL for imageId: {}", imageId);

        ImageFile file = fetchImageFile(imageId);

        // require completed status (avoid exposing pending/expired records)
        if (file.getUploadStatus() != UploadStatus.UPLOAD_COMPLETE) {
            log.warn("Image with id {} not available for download - status: {}", imageId, file.getUploadStatus());
            throw new ObjectNotFoundInS3Exception(HttpStatus.NOT_FOUND, "Image not available for download");
        }

        ObjectHead head = getObjectHead(file.getObjectKey());

        if (!head.isPresent()) {
            log.warn("Object not found in S3 for imageId: {} and key: {}", imageId, file.getObjectKey());
            throw new ObjectNotFoundInS3Exception(HttpStatus.NOT_FOUND, "Object not found in S3");
        }

        Duration expiry = awsProperties.getS3().getPresign().getDownloadTtl();
        URL presignedGetUrl = s3Service.generatePresignedGetUrl(file.getObjectKey(), expiry);

        log.debug("PresignedUpload GET URL generated successfully for imageId: {}", imageId);
        return new UploadResult.PresignedDownload(presignedGetUrl, expiry);
    }

    @Transactional
    public DownloadFile getImage(UUID imageId) throws IOException {
        log.debug("Attempting to retrieve image with ID: {}", imageId);

        ImageFile file = fetchImageFile(imageId);
        byte[] bytes = s3Service.getObject(file.getObjectKey());

        return DownloadFile.of(file.getContentType(), bytes);
    }

    @Transactional
    public boolean delete(UUID imageId) {
        log.debug("Attempting to delete image with ID: {}", imageId);
        ImageFile file = fetchImageFile(imageId);
        s3Service.deleteObject(file.getObjectKey());
        imageFileRepo.delete(file);
        log.info("Image deleted successfully. ObjectKey: {}", file.getObjectKey());
        return true;
    }

    // ========================= Private Helpers =========================

    private ImageFile fetchImageFile(UUID imageId) {
        return imageFileRepo.findById(imageId)
                .orElseThrow(() -> {
                    log.warn("Image not found in DB for ID: {}", imageId);
                    return new ImageNotFoundByIdException(HttpStatus.NOT_FOUND, "Image not found by Id");
                });
    }

    private ObjectHead getObjectHead(String objectKey) {
        return SafeExecutor.safeExecute(
                () -> s3Service.doesObjectExist(objectKey),
                (e) -> {
                    log.error("S3 check failed for key {}: {}", objectKey, e.getMessage(), e);
                    throw new ObjectNotFoundInS3Exception(HttpStatus.SERVICE_UNAVAILABLE, "S3 unavailable, try again");
                }
        );
    }
}
