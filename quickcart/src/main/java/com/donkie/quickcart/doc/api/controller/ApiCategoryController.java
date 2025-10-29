package com.donkie.quickcart.doc.api.controller;

import com.donkie.quickcart.doc.api.dto.ApiCategoryRequest;
import com.donkie.quickcart.doc.api.dto.ApiCategoryResponse;
import com.donkie.quickcart.doc.api.dto.ApiCategorySummary;
import com.donkie.quickcart.doc.application.service.ApiCategoryService;
import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/v1/docs")
@RequiredArgsConstructor
@Slf4j
public class ApiCategoryController {

    private final ApiCategoryService service;

    @PostMapping("/api-categories")
    public ResponseEntity<ApiAck> create(@RequestBody @Valid ApiCategoryRequest request) {
        UUID id = service.createCategory(request);
        return ResponseEntity
                .created(URI.create("/api/v1/docs/categories/" + id))
                .body(ApiAck.success("Category created successfully"));
    }

    @PutMapping("/api-categories/{categoryId}")
    public ResponseEntity<ApiResponse<ApiCategorySummary>> update(@PathVariable UUID categoryId,
                                                                  @RequestBody ApiCategoryRequest request) {
        ApiCategorySummary summary = service.updateCategory(categoryId, request);
        return ResponseEntity.ok(ApiResponse.success("API Category Updated.", summary));
    }

    @DeleteMapping("/api-categories/{categoryId}")
    public ResponseEntity<ApiAck> delete(@PathVariable UUID categoryId) {
        service.deleteCategory(categoryId);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(ApiAck.success("Category created successfully"));
    }

    @GetMapping("/api-categories/{categoryId}")
    public ResponseEntity<ApiResponse<ApiCategorySummary>> get(@PathVariable UUID categoryId) {
        ApiCategorySummary cat = service.getCategory(categoryId);
        return ResponseEntity
                .ok(ApiResponse.success("Category Fetched", cat));
    }
}
