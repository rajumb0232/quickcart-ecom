package com.donkie.quickcart.seller.infra.service;

import com.donkie.quickcart.seller.application.exception.ProductVariantNotFoundException;
import com.donkie.quickcart.seller.application.service.contracts.ProductGalleryService;
import com.donkie.quickcart.seller.domain.repository.ProductRepository;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import com.donkie.quickcart.uploads.api.dto.ContentType;
import com.donkie.quickcart.uploads.api.dto.DownloadFile;
import com.donkie.quickcart.uploads.api.dto.S3PresignedUpload;
import com.donkie.quickcart.uploads.application.model.UploadResult;
import com.donkie.quickcart.uploads.application.service.ImageUploadService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class ProductGalleryServiceImpl implements ProductGalleryService {
    private final ImageUploadService imageUploadService;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    @Override
    public List<S3PresignedUpload> presignImageUploads(UUID variantId, int uploadCount, ContentType contentType, String differentiatorName) {
        log.debug("Generating presigned PUT URL for product images, differentiator: {}", differentiatorName);

        List<S3PresignedUpload> signs = new ArrayList<>();
        for (int i = 0; i < uploadCount; i++) {
            log.debug("Uploading image {} for product variant: {}", i, variantId);
            UploadResult.PresignedUpload presigned = imageUploadService.upload(contentType, differentiatorName);
            var sign = new S3PresignedUpload(
                    presigned.objectKey(),
                    presigned.url().toString(),
                    presigned.uploadWindow().toSeconds()
            );
            signs.add(sign);
        }

        return signs;
    }

    @Transactional
    @Override
    public void confirmImageUploads(UUID variantId, String[] objectKeys, String differentiatorName) {
        var variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ProductVariantNotFoundException(HttpStatus.NOT_FOUND, "Product not found"));

        for (String objectKey : objectKeys) {
            UploadResult.Summary summary = imageUploadService.markUploadAsCompleted(differentiatorName, objectKey);
            if (!summary.isSuccessful()) {
                log.warn("Upload completion not successful for objectKey: {} (product variant: {})", objectKey, variantId);
                return;
            }
            variant.getImages().add(summary.image());
        }
        productVariantRepository.save(variant);
    }

    @Override
    public DownloadFile getImage(UUID imageId) {
        try {
            return imageUploadService.getImage(imageId);
        } catch (IOException e) {
            log.error("Failed to retrieve product Image for by ID: {} -> {}", imageId, e.getMessage(), e);
            throw new QuickcartBaseException(HttpStatus.NOT_FOUND, "Product image not found");
        }
    }
}
