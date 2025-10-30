package com.donkie.quickcart.uploads.infra.integration.s3;

import com.donkie.quickcart.uploads.api.dto.ContentType;
import com.donkie.quickcart.uploads.application.model.ObjectHead;
import com.donkie.quickcart.uploads.infra.integration.config.AwsProperties;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.DeleteObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;

@Service
public class S3Service {

    private final S3Presigner presigner;
    private final S3Client s3;
    private final String bucket;

    public S3Service(S3Presigner presigner, S3Client s3, AwsProperties props) {
        this.presigner = presigner;
        this.s3 = s3;
        this.bucket = props.getS3().getBucket();
    }

    public URL generatePresignedPutUrl(ContentType contentType, String objectKey, Duration expiry) {
        PutObjectRequest putObjReq = PutObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .contentType(contentType.value())
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(expiry)
                .putObjectRequest(putObjReq)
                .build();

        PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);
        return presignedRequest.url();
    }

    public URL generatePresignedGetUrl(String objectKey, Duration expiry) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignGetRequest = GetObjectPresignRequest.builder()
                .getObjectRequest(getObjectRequest)
                .signatureDuration(expiry)
                .build();

        return presigner.presignGetObject(presignGetRequest).url();
    }

    public URL generatePresignedDeleteUrl(String objectKey, Duration expiry) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .build();

        DeleteObjectPresignRequest presignDeleteRequest = DeleteObjectPresignRequest.builder()
                .deleteObjectRequest(deleteRequest)
                .signatureDuration(expiry)
                .build();

        return presigner.presignDeleteObject(presignDeleteRequest).url();
    }

    public void deleteObject(String objectKey) {
        s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(objectKey).build());
    }

    public ObjectHead doesObjectExist(String objectKey) {
        try {
            var head = s3.headObject(HeadObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .build());
            return ObjectHead.found(head.contentType());
        } catch (NoSuchKeyException e) {
            return ObjectHead.notFound();
        } catch (S3Exception e) {
            if (e.statusCode() == 404) ObjectHead.notFound();
            throw e;
        }
    }

    public byte[] getObject(String objectKey) throws IOException {
        try (ResponseInputStream<GetObjectResponse> inputStream = s3.getObject(
                GetObjectRequest.builder()
                        .bucket(bucket)
                        .key(objectKey)
                        .build())) {
            return inputStream.readAllBytes();
        }
    }
}
