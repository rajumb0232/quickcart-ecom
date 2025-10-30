package com.donkie.quickcart.admin.api.controller;

import com.donkie.quickcart.admin.application.service.CategoryThumbnailService;
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

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class CategoryThumbnailController {
    public static final String CATEGORY_THUMBNAIL_DIFFERENTIATOR = "category_thumbnail";

    private final CategoryThumbnailService thumbnailService;

    /**
     * Generates a presigned URL for uploading a new category thumbnail.
     */
    @PostMapping("/categories/thumbnail/presign-upload")
    public ResponseEntity<ApiResponse<S3PresignedUpload>> presignThumbnailUpload(@RequestBody ContentType contentType) {
        contentType.mustStartWith("image/");
        S3PresignedUpload response = thumbnailService.presignUploadURL(contentType, CATEGORY_THUMBNAIL_DIFFERENTIATOR);
        return ResponseEntity.ok(ApiResponse.success(
                "Generated presigned-URL for category thumbnail upload",
                response
        ));
    }

    /**
     * Confirms a successful thumbnail upload and updates the category reference.
     */
    @PostMapping("/categories/{categoryId}/thumbnail/confirm-upload")
    public ResponseEntity<ApiAck> confirmThumbnailUpload(
            @PathVariable UUID categoryId,
            @RequestParam String objectKey
    ) {
        thumbnailService.confirmUpload(categoryId, objectKey, CATEGORY_THUMBNAIL_DIFFERENTIATOR);
        return ResponseEntity.ok(ApiAck.success("Thumbnail upload completed successfully"));
    }

    @GetMapping("/public/categories/thumbnail")
    public ResponseEntity<byte[]> downloadThumbnail(@RequestParam("id") UUID imageId) {
        DownloadFile file = thumbnailService.getThumbnail(imageId);

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
