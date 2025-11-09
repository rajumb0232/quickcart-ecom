package com.donkie.quickcart.seller.api.controller;

import com.donkie.quickcart.seller.application.dto.request.ProductVariantRequest;
import com.donkie.quickcart.seller.application.dto.response.ProductByVariantResponse;
import com.donkie.quickcart.seller.application.dto.response.ProductVariantResponse;
import com.donkie.quickcart.seller.application.service.contracts.ProductVariantService;
import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class ProductVariantController {
    private final ProductVariantService variantService;

    @PostMapping("/products/{productId}/variants")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> createVariant(
            @PathVariable UUID productId,
            @RequestBody @Valid ProductVariantRequest request
    ) {
        var response = variantService.createProductVariant(productId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .location(URI.create("/api/v1/products/" + productId))
                .body(ApiResponse.success("Product Variant Created.", response));
    }

    /**
     * Get product by variant ID.
     * Useful when product details need to be found when associated with orders, sales, etc.
     */
    @GetMapping("/variants/{variantId}")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> getVariant(@PathVariable UUID variantId) {
        var response = variantService.getVariant(variantId);
        return ResponseEntity.ok(ApiResponse.success(
                response.isDeleted() ? "Retrieved deleted product record." : "Product found.",
                response
        ));
    }

    @PutMapping("/variants/{variantId}")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> updateVariant(
            @PathVariable UUID variantId,
            @RequestBody @Valid ProductVariantRequest request
    ) {
        var response = variantService.updateProductVariant(variantId, request);
        return ResponseEntity.ok(ApiResponse.success("Product Variant Updated.", response));
    }

    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<ApiAck> deleteVariant(@PathVariable UUID variantId) {
        variantService.deleteProductVariant(variantId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiAck.success("Product Variant Deleted."));
    }

}
