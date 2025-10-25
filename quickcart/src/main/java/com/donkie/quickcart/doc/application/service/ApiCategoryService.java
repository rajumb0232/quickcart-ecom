package com.donkie.quickcart.doc.application.service;

import com.donkie.quickcart.doc.api.dto.*;
import com.donkie.quickcart.doc.domain.model.ApiCategory;
import com.donkie.quickcart.doc.domain.model.ApiEndpoint;
import com.donkie.quickcart.doc.domain.repository.ApiCategoryRepo;
import com.donkie.quickcart.doc.domain.repository.ApiEndpointRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ApiCategoryService {

    private final ApiCategoryRepo categoryRepo;
    private final ApiEndpointRepo apiEndpointRepo;
    private final MarkdownService markdownService;

    @Transactional
    public UUID createCategory(ApiCategoryRequest req) {
        ApiCategory entity = new ApiCategory();
        entity.setName(req.name());
        entity.setDescription(req.description());
        entity.setDisplayOrder(req.displayOrder());
        ApiCategory saved = categoryRepo.save(entity);
        return saved.getCategoryId();
    }

    @Transactional
    public ApiCategorySummary updateCategory(UUID categoryId, ApiCategoryRequest req) {
        ApiCategory entity = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryId));
        entity.setName(req.name());
        entity.setDescription(req.description());
        entity.setDisplayOrder(req.displayOrder());
        ApiCategory saved = categoryRepo.save(entity);
        return new ApiCategorySummary(
                saved.getCategoryId(),
                saved.getName(),
                entity.getDescription(),
                entity.getDisplayOrder()
        );
    }

    @Transactional
    public void deleteCategory(UUID categoryId) {
        if (!categoryRepo.existsById(categoryId)) {
            throw new EntityNotFoundException("Category not found: " + categoryId);
        }
        categoryRepo.deleteById(categoryId);
    }

    @Transactional(readOnly = true)
    public ApiCategorySummary getCategory(UUID categoryId) {
        ApiCategory entity = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryId));
        return  new ApiCategorySummary(
                entity.getCategoryId(),
                entity.getName(),
                entity.getDescription(),
                entity.getDisplayOrder()
        );
    }

    @Transactional(readOnly = true)
    public List<ApiCategoryResponse> getAllCategories(UUID categoryInViewId, UUID endpointInViewId) {
        return categoryRepo.findAll().stream()
                .sorted(Comparator.comparing(ApiCategory::getDisplayOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(this::toResponse)
                .toList();
    }

    private ApiCategoryResponse toResponse(ApiCategory category) {
        List<ApiEndpointDetail> endpoints = category.getEndpoints() == null ? List.of() : category.getEndpoints()
                .stream()
                .sorted(Comparator.comparing(ApiEndpoint::getDisplayOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(e -> {
                    // Convert Markdown to HTML
                    String base64String = e.getMarkdownContent();
                    String decodedMarkdown = new String(java.util.Base64.getDecoder().decode(base64String));
                    String htmlContent = markdownService.convertToHtml(decodedMarkdown);

                    return new ApiEndpointDetail(
                            e.getEndpointId(),
                            e.getTitle(),
                            e.getDisplayOrder(),
                            htmlContent  // Pass HTML as content
                    );
                })
                .toList();
        return new ApiCategoryResponse(
                category.getCategoryId(),
                category.getName(),
                category.getDescription(),
                category.getDisplayOrder(),
                endpoints
        );
    }
}
