package com.donkie.quickcart.seller.application.service.contracts;

import com.donkie.quickcart.uploads.api.dto.ContentType;
import com.donkie.quickcart.uploads.api.dto.DownloadFile;
import com.donkie.quickcart.uploads.api.dto.S3PresignedUpload;

import java.util.List;
import java.util.UUID;

public interface ProductGalleryService {
    List<S3PresignedUpload> presignImageUploads(UUID variantId, int uploadCount, ContentType contentType, String productGalleryDifferentiator);

    void confirmImageUploads(UUID variantId, String[] objectKeys, String productGalleryDifferentiator);

    DownloadFile getImage(UUID imageId);

    void deleteImage(UUID imageId);
}
