package com.donkie.quickcart.admin.application.service;

import com.donkie.quickcart.admin.application.exception.CategoryNotFoundException;
import com.donkie.quickcart.admin.domain.repository.CategoryRepo;
import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import com.donkie.quickcart.shared.exception.handler.SafeExecutor;
import com.donkie.quickcart.uploads.api.dto.ContentType;
import com.donkie.quickcart.uploads.api.dto.DownloadFile;
import com.donkie.quickcart.uploads.api.dto.S3PresignedDownload;
import com.donkie.quickcart.uploads.api.dto.S3PresignedUpload;
import com.donkie.quickcart.uploads.application.model.UploadResult;
import com.donkie.quickcart.uploads.application.service.ImageUploadService;
import com.donkie.quickcart.uploads.domain.model.ImageFile;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class CategoryThumbnailService {

    private final ImageUploadService imageUploadService;
    private final CategoryRepo categoryRepo;

    /**
     * Generates a presigned PUT URL for uploading a new thumbnail image.
     *
     * @param contentType        the content type of the image
     * @param differentiatorName category-specific differentiator name
     * @return S3PresignedUpload containing URL and expiry time
     */
    public S3PresignedUpload presignUploadURL(ContentType contentType, String differentiatorName) {
        log.debug("Generating presigned PUT URL for category thumbnail, differentiator: {}", differentiatorName);

        UploadResult.PresignedUpload presigned = imageUploadService.upload(contentType, differentiatorName);

        return new S3PresignedUpload(
                presigned.objectKey(),
                presigned.url().toString(),
                presigned.uploadWindow().toSeconds()
        );
    }

    /**
     * Marks a category thumbnail upload as complete, updates the category with the new image,
     * and deletes the previous one (if any).
     *
     * @param categoryId         the category ID
     * @param objectKey          the S3 object key of the new image
     * @param differentiatorName the differentiator name used when uploading
     */
    public void confirmUpload(UUID categoryId, String objectKey, String differentiatorName) {
        log.debug("Marking thumbnail upload as completed for categoryId: {}, objectKey: {}", categoryId, objectKey);

        var category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(HttpStatus.NOT_FOUND, "Category not found"));

        UploadResult.Summary summary = imageUploadService.markUploadAsCompleted(differentiatorName, objectKey);
        if (!summary.isSuccessful()) {
            log.warn("Upload completion not successful for objectKey: {} (categoryId: {})", objectKey, categoryId);
            return;
        }

        // Delete existing thumbnail if it exists
        ImageFile existingThumbnail = category.getThumbnail();
        deleteExistingThumbnailIfPresent(categoryId, existingThumbnail);

        // Assign new thumbnail
        category.setThumbnail(summary.image());
        categoryRepo.save(category);

        log.info("Updated category thumbnail successfully for categoryId: {}", categoryId);
    }

    private void deleteExistingThumbnailIfPresent(UUID categoryId, ImageFile existingThumbnail) {
        if (existingThumbnail != null) {
            UUID existingImageId = existingThumbnail.getImageId();
            String existingObjectKey = existingThumbnail.getObjectKey();

            log.info("Deleting old thumbnail for categoryId: {} (imageId: {}, key: {})",
                    categoryId, existingImageId, existingObjectKey);

            SafeExecutor.executeOrElseDo(
                    () -> imageUploadService.delete(existingImageId),
                    (e) -> log.warn("Failed to delete old thumbnail for categoryId: {}, imageId: {}, key: {} -> {}",
                            categoryId, existingImageId, existingObjectKey, e.getMessage())
            );
        }
    }

    public S3PresignedDownload presignDownloadURL(UUID imageId) {
        var presigned = imageUploadService.getPresignedDownloadUrl(imageId);
        return new S3PresignedDownload(
                presigned.url().toString(),
                presigned.downloadWindow().getSeconds()
        );
    }

    public DownloadFile getThumbnail(UUID imageId) {
        try {
            return imageUploadService.getImage(imageId);
        } catch (IOException e) {
            log.error("Failed to retrieve thumbnail for imageId: {} -> {}", imageId, e.getMessage(), e);
            throw new QuickcartBaseException(HttpStatus.NOT_FOUND, "Category Thumbnail not found");
        }
    }
}
