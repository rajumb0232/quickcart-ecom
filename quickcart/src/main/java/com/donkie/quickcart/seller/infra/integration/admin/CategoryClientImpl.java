package com.donkie.quickcart.seller.infra.integration.admin;

import com.donkie.quickcart.admin.application.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * This class implements the client while coupling with cross domain services,
 * but this can be replaced with valid client implementation for HTTP calls in future for microservice architecture
 */
@Service
@AllArgsConstructor
public class CategoryClientImpl implements CategoryClient{
    private final CategoryService categoryService;

    @Override
    public Optional<CategorySnapshot> getCategorySnapshot(UUID categoryId) {
        var snapshot = categoryService.getCategorySnapshot(categoryId);
        return snapshot != null
                ? Optional.of(new CategorySnapshot(snapshot.path()))
                : Optional.empty();
    }
}
