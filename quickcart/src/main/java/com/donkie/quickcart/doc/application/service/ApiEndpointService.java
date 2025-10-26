package com.donkie.quickcart.doc.application.service;

import com.donkie.quickcart.doc.api.dto.ApiEndpointDetail;
import com.donkie.quickcart.doc.api.dto.ApiEndpointRequest;
import com.donkie.quickcart.doc.api.dto.ApiEndpointSummary;
import com.donkie.quickcart.doc.domain.model.ApiCategory;
import com.donkie.quickcart.doc.domain.model.ApiEndpoint;
import com.donkie.quickcart.doc.domain.model.HttpMethod;
import com.donkie.quickcart.doc.domain.repository.ApiCategoryRepo;
import com.donkie.quickcart.doc.domain.repository.ApiEndpointRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ApiEndpointService {

    private final ApiEndpointRepo endpointRepo;
    private final ApiCategoryRepo categoryRepo;
    private final MarkdownService markdownService;

    @Transactional
    public UUID createEndpointDoc(UUID categoryId, ApiEndpointRequest req) {
        ApiCategory category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryId));
        ApiEndpoint endpoint = ApiEndpoint.builder()
                .title(req.title())
                .category(category)
                .markdownContent(req.markdown())
                .displayOrder(req.displayOrder())
                .build();
        ApiEndpoint saved = endpointRepo.save(endpoint);
        return saved.getEndpointId();
    }

    @Transactional
    public ApiEndpointSummary updateEndpointDoc(UUID endpointId, ApiEndpointRequest req) {
        var endpoint = getApiEndpoint(endpointId);
        endpoint.setTitle(req.title());
        endpoint.setMarkdownContent(req.markdown());
        endpoint.setDisplayOrder(req.displayOrder());
        endpoint.setMethod(req.method());
        ApiEndpoint saved = endpointRepo.save(endpoint);
        return new ApiEndpointSummary(saved.getEndpointId(), saved.getTitle(), saved.getDisplayOrder(), saved.getMethod());
    }

    @Transactional
    public ApiEndpointSummary updateEndpointMethod(UUID endpointId, HttpMethod methodType) {
        var endpoint = getApiEndpoint(endpointId);
        endpoint.setMethod(methodType);
        ApiEndpoint saved = endpointRepo.save(endpoint);
        return new ApiEndpointSummary(saved.getEndpointId(), saved.getTitle(), saved.getDisplayOrder(), saved.getMethod());
    }

    @Transactional
    public ApiEndpointSummary updateEndpointTitle(UUID endpointId, String title) {
        var endpoint = getApiEndpoint(endpointId);
        endpoint.setTitle(title);
        ApiEndpoint saved = endpointRepo.save(endpoint);
        return new ApiEndpointSummary(saved.getEndpointId(), saved.getTitle(), saved.getDisplayOrder(), saved.getMethod());
    }

    @Transactional
    public ApiEndpointSummary updateEndpointDisplayOrder(UUID endpointId, Integer displayOrder) {
        var endpoint = getApiEndpoint(endpointId);
        endpoint.setDisplayOrder(displayOrder);
        ApiEndpoint saved = endpointRepo.save(endpoint);
        return new ApiEndpointSummary(saved.getEndpointId(), saved.getTitle(), saved.getDisplayOrder(), saved.getMethod());
    }

    @Transactional
    public void deleteEndpointDoc(UUID endpointId) {
        var endpoint = getApiEndpoint(endpointId);
        endpointRepo.delete(endpoint);
    }

    @Transactional(readOnly = true)
    public ApiEndpointDetail getEndpointDoc(UUID endpointId) {
        var endpoint = getApiEndpoint(endpointId);
        String htmlContent = markdownService.convertToHtml(endpoint.getMarkdownContent());
        return new ApiEndpointDetail(endpoint.getEndpointId(), endpoint.getTitle(), endpoint.getDisplayOrder(), endpoint.getMethod(), htmlContent);
    }

    private ApiEndpoint getApiEndpoint(UUID endpointId) {
        return endpointRepo.findById(endpointId)
                .orElseThrow(() -> new EntityNotFoundException("Endpoint not found: " + endpointId));
    }
}
