package com.donkie.quickcart.seller.api.controller;

import com.donkie.quickcart.seller.application.dto.request.ProductFilters;
import com.donkie.quickcart.seller.application.dto.request.ProductRequest;
import com.donkie.quickcart.seller.application.dto.response.ProductResponse;
import com.donkie.quickcart.seller.application.service.contracts.ProductService;
import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/stores/{storeId}/categories/{categoryId}/products")
    public ResponseEntity<ApiAck> createProduct(
            @PathVariable UUID storeId,
            @PathVariable UUID categoryId,
            @RequestBody @Valid ProductRequest request
    ) {
        UUID id = productService.createProduct(storeId, categoryId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .location(URI.create("/api/v1/public/products/" + id))
                .body(ApiAck.success("Product Created."));
    }

    @GetMapping("/public/products/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductForPublic(@PathVariable UUID productId) {
        ProductResponse response = productService.getProduct(productId);
        return ResponseEntity.ok(ApiResponse.success(
                "Product Found",
                response
        ));
    }

    @PostMapping("/products/{productId}/publish")
    public ResponseEntity<ApiAck> publishProduct(@PathVariable UUID productId) {
        productService.publishProduct(productId);
        return ResponseEntity.ok(ApiAck.success("Product Published."));
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable UUID productId) {
        ProductResponse response = productService.getProduct(productId);
        return ResponseEntity.ok(ApiResponse.success(
                "Product Found",
                response
        ));
    }

    @GetMapping("/public/products/filter")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByFilter(
            @ModelAttribute ProductFilters filters,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {

        log.debug("Searching products by filters: brand: {} categories: {} rating: {} minPrice: {} maxPrice: {}",
                filters.brand(), Arrays.toString(filters.categories()), filters.rating(), filters.minPrice(), filters.maxPrice());

        List<ProductResponse> response = productService.getProductsByFilter(filters, page, size);
        return ResponseEntity.ok(ApiResponse.success("Products Found", response));
    }


    @PutMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable UUID productId,
            @RequestBody @Valid ProductRequest request
    ) {
        ProductResponse response = productService.updateProduct(productId, request);
        return ResponseEntity.ok(ApiResponse.success(
                "Product Updated",
                response
        ));
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<ApiAck> deleteProduct(@PathVariable UUID productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiAck.success("Product Deleted."));
    }
}
