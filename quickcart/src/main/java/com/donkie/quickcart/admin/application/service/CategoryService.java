package com.donkie.quickcart.admin.application.service;

import com.donkie.quickcart.admin.application.dto.request.CategoryCreateRequest;
import com.donkie.quickcart.admin.application.dto.request.CategoryUpdateRequest;
import com.donkie.quickcart.admin.application.dto.response.CategoryDetail;
import com.donkie.quickcart.admin.application.dto.response.CategorySummary;
import com.donkie.quickcart.admin.domain.model.CategoryStatus;

import java.util.List;
import java.util.UUID;

public interface CategoryService {

    /**
     * Create a new category. Map to a Parent if Parent ID is not null
     *
     * @param request category request containing category details
     * @param parentId parent category ID (optional)
     * @return category ID of the newly created category
     */
    UUID createCategory(CategoryCreateRequest request, UUID parentId);

    /**
     * Update an existing category
     *
     * @param categoryId category ID of the category to be updated
     * @param request category update request containing updated category details
     * @return category summary of the updated category
     */
    CategorySummary updateCategory(UUID categoryId, CategoryUpdateRequest request);

    /**
     * Get a category by ID
     *
     * @param categoryId category ID of the category to be retrieved
     * @return category summary of the retrieved category
     */
    CategorySummary getCategory(UUID categoryId);

    /**
     * Get a list of all categories in the catalog
     *
     * @return list of category summaries of all categories in the catalog
     */
    List<CategoryDetail> getCategoryCatalogue();

    /**
     * Update the status of a category
     *
     * @param categoryId category ID of the category to be updated
     * @param categoryStatus new status of the category
     * @return category summary of the updated category
     */
    CategorySummary updateCategoryStatus(UUID categoryId, CategoryStatus categoryStatus);

    /**
     * Update the parent of a category
     *
     * @param categoryId category ID of the category to be updated
     * @param parentId parent category ID to be set as the new parent
     * @return category summary of the updated category
     */
    CategorySummary updateCategoryParent(UUID categoryId, UUID parentId);

    List<CategoryDetail> getCategoriesOfAllStatus();
}
