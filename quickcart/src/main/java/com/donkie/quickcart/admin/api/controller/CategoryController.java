package com.donkie.quickcart.admin.api.controller;

import com.donkie.quickcart.admin.application.dto.request.CategoryCreateRequest;
import com.donkie.quickcart.admin.application.dto.request.CategoryUpdateRequest;
import com.donkie.quickcart.admin.application.dto.response.CategoryDetail;
import com.donkie.quickcart.admin.application.dto.response.CategorySummary;
import com.donkie.quickcart.admin.application.service.CategoryService;
import com.donkie.quickcart.admin.domain.model.CategoryStatus;
import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/categories")
    public ResponseEntity<ApiAck> createCategory(
            @Valid @RequestBody CategoryCreateRequest request,
            @RequestParam(required = false) UUID parentId
            ) {
        UUID id = categoryService.createCategory(request, parentId);
        return ResponseEntity
                .created(URI.create("/api/v1/categories/" + id))
                .body(ApiAck.success("Category Created"));
    }

    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse<CategorySummary>> getCategory(
            @PathVariable UUID categoryId
            ) {
        CategorySummary summary = categoryService.getCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Category Retrieved", summary));
    }

    @GetMapping("/public/categories")
    public ResponseEntity<ApiResponse<List<CategoryDetail>>> getCategoryCatalogue() {
        List<CategoryDetail> catalogue = categoryService.getCategoryCatalogue();
        return ResponseEntity.ok(ApiResponse.success("Category Catalogue Retrieved", catalogue));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDetail>>> getCategoriesOfAllStatus() {
        List<CategoryDetail> catalogue = categoryService.getCategoriesOfAllStatus();
        return ResponseEntity.ok(ApiResponse.success("Category Catalogue Retrieved", catalogue));
    }

    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse<CategorySummary>> updateCategory(
            @PathVariable UUID categoryId,
            @Valid @RequestBody CategoryUpdateRequest request
    ) {
        CategorySummary summary = categoryService.updateCategory(categoryId, request);
        return ResponseEntity.ok(ApiResponse.success("Category Updated", summary));
    }

    @PatchMapping("/categories/{categoryId}/status")
    public ResponseEntity<ApiResponse<CategorySummary>> updateCategoryStatus(
            @PathVariable UUID categoryId,
            @RequestParam("value") CategoryStatus categoryStatus
            ) {
        CategorySummary summary = categoryService.updateCategoryStatus(categoryId, categoryStatus);
        return ResponseEntity.ok(ApiResponse.success("Category Status Updated", summary));
    }

    @PatchMapping("/categories/{categoryId}/parent")
    public ResponseEntity<ApiResponse<CategorySummary>> updateCategoryParent(
            @PathVariable UUID categoryId,
            @RequestParam("parent_id") UUID parentId
            ) {
        CategorySummary summary = categoryService.updateCategoryParent(categoryId, parentId);
        return ResponseEntity.ok(ApiResponse.success("Category Parent Updated", summary));
    }
}
