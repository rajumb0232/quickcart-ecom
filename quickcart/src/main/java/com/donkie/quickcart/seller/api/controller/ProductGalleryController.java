package com.donkie.quickcart.seller.api.controller;

import com.donkie.quickcart.seller.application.service.contracts.ProductGalleryService;
import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import com.donkie.quickcart.uploads.api.dto.ContentType;
import com.donkie.quickcart.uploads.api.dto.DownloadFile;
import com.donkie.quickcart.uploads.api.dto.S3PresignedUpload;
import lombok.AllArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class ProductGalleryController {
    private static final String PRODUCT_GALLERY_DIFFERENTIATOR = "product_gallery";

    private final ProductGalleryService productGalleryService;

    @PostMapping("/products/variants/{variantId}/images/presign")
    public ResponseEntity<ApiResponse<List<S3PresignedUpload>>> presignImageUploads(
            @PathVariable UUID variantId,
            @RequestParam("upload_count") int uploadCount,
            @RequestBody ContentType contentType
            ) {
        contentType.mustStartWith("image/");
        List<S3PresignedUpload> response = productGalleryService.presignImageUploads(variantId, uploadCount, contentType, PRODUCT_GALLERY_DIFFERENTIATOR);
        return ResponseEntity.ok(ApiResponse.success(
                "Generated presigned-URLs for product images upload",
                response
        ));
    }

    @PostMapping("/products/variants/{variantId}/images/confirm-upload")
    public ResponseEntity<ApiAck> confirmImageUploads(
            @PathVariable UUID variantId,
            @RequestParam String[] objectKeys
            ) {
        productGalleryService.confirmImageUploads(variantId, objectKeys, PRODUCT_GALLERY_DIFFERENTIATOR);
        return ResponseEntity.ok(ApiAck.success("Image upload completed successfully"));
    }

    @GetMapping("/public/products/variants/images/{imageId}")
    public ResponseEntity<byte[]> getImageUploads(
            @PathVariable UUID imageId
            ) {
        DownloadFile file = productGalleryService.getImage(imageId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .cacheControl(CacheControl
                        .maxAge(7, TimeUnit.DAYS)         // Browser cache: 7 days
                        .sMaxAge(365, TimeUnit.DAYS)     // CDN cache: 1 year
                        .cachePublic()
                        .immutable())                            // Optional: treats as versioned resource
                .body(file.bytes());
    }

}
