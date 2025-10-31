package com.donkie.quickcart.admin.infra.service;

import com.donkie.quickcart.admin.application.dto.request.CategoryCreateRequest;
import com.donkie.quickcart.admin.application.dto.request.CategoryUpdateRequest;
import com.donkie.quickcart.admin.application.dto.response.CategoryDetail;
import com.donkie.quickcart.admin.application.dto.response.CategorySnapshot;
import com.donkie.quickcart.admin.application.dto.response.CategorySummary;
import com.donkie.quickcart.admin.application.exception.CategoryLevelOutOfRangeException;
import com.donkie.quickcart.admin.application.exception.CategoryNotFoundException;
import com.donkie.quickcart.admin.application.exception.CyclicalCategoryMappingException;
import com.donkie.quickcart.admin.application.exception.ParentCategoryNotFoundException;
import com.donkie.quickcart.admin.application.service.CategoryService;
import com.donkie.quickcart.admin.domain.model.Category;
import com.donkie.quickcart.admin.domain.model.CategoryStatus;
import com.donkie.quickcart.admin.domain.repository.CategoryRepo;
import com.donkie.quickcart.admin.infra.usecases.GetCategoriesByStatusUseCase;
import com.donkie.quickcart.admin.infra.usecases.UpdateCategoryParentUseCase;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepo categoryRepo;
    private final GetCategoriesByStatusUseCase getAllCategoriesByStatus;
    private final UpdateCategoryParentUseCase updateCategoryParentUseCase;

    /**
     * @throws ParentCategoryNotFoundException  if the parent category is not null is not found.
     * @throws CategoryLevelOutOfRangeException if the suggested parent category is with level 3 cannot have descendant categories.
     * @implSpec The Category is mapped to a parent only of the parent ID is not null.
     * If null, the Category itself becomes the Root Parent.
     */
    @Transactional
    @Override
    public UUID createCategory(CategoryCreateRequest request, UUID parentId) {
        Category category = new Category();
        category.setName(request.name());

        // Adding parent is optional
        if (parentId != null) {
            Category parent = fetchParentCategory(parentId);
            updateCategoryParentUseCase.execute(parent, category);
        }

        Category saved = categoryRepo.save(category);
        return saved.getCategoryId();
    }

    /**
     * @throws CategoryNotFoundException if the category is not found.
     * @implSpec The Category is updated only if the input and existing data differs.
     * And avoid any default or null values in input.
     */
    @Transactional
    @Override
    public CategorySummary updateCategory(UUID categoryId, CategoryUpdateRequest request) {
        var category = fetchCategory(categoryId);
        if (request.name() != null) {
            category.setName(request.name());
        }
        if (request.categoryStatus() != null) {
            category.setCategoryStatus(request.categoryStatus());
        }
        Category saved = categoryRepo.save(category);
        return toCategorySummary(saved);
    }

    /**
     * @throws CategoryNotFoundException if the category is not found.
     * @implSpec Updates the status of the category.
     */
    @Transactional
    @Override
    public CategorySummary updateCategoryStatus(UUID categoryId, CategoryStatus categoryStatus) {
        var category = fetchCategory(categoryId);
        category.setCategoryStatus(categoryStatus);
        Category saved = categoryRepo.save(category);
        return toCategorySummary(saved);
    }

    /**
     * @throws CategoryNotFoundException        if the category is not found.
     * @throws ParentCategoryNotFoundException  if the new parent category is not found
     * @throws CyclicalCategoryMappingException if the new parent is a descendant of the category to avoid cycles.
     * @implSpec Updates the parent of the category.
     */
    @Transactional
    @Override
    public CategorySummary updateCategoryParent(UUID categoryId, UUID parentId) {
        // ensure the parent and child are not the same.
        if (categoryId.equals(parentId)) {
            throw new CyclicalCategoryMappingException(HttpStatus.BAD_REQUEST, "Category cannot be its own parent");
        }

        var category = fetchCategory(categoryId);

        // Prevent no-op update
        if (category.getParent() != null &&
                category.getParent().getCategoryId().equals(parentId)) {
            // Already has this parent, return current state
            return toCategorySummary(category);
        }

        var newParent = fetchParentCategory(parentId);
        return updateCategoryParentUseCase.execute(newParent, category);
    }

    /**
     * @throws CategoryNotFoundException if the category is not found.
     * @implSpec Fetches the category by ID.
     */
    @Transactional(readOnly = true)
    @Override
    public CategorySummary getCategory(UUID categoryId) {
        var category = fetchCategory(categoryId);
        return toCategorySummary(category);
    }

    /**
     * @implSpec Fetches all categories in the catalog with status ACTIVE
     */
    @Transactional(readOnly = true)
    @Override
    public List<CategoryDetail> getCategoryCatalogue() {
        return getAllCategoriesByStatus.execute(List.of(CategoryStatus.ACTIVE));
    }


    /**
     * @implSpec Fetches all categories in the catalog with all statuses.
     */
    @Override
    public List<CategoryDetail> getCategoriesOfAllStatus() {
        return getAllCategoriesByStatus.execute(Arrays.stream(CategoryStatus.values()).toList());
    }

    @Override
    public CategorySnapshot getCategorySnapshot(UUID categoryId) {
        String path = deriveCategoryPath(fetchCategory(categoryId));
        return new CategorySnapshot(path);
    }

    // ==================== HELPER METHODS ======================

    private String deriveCategoryPath(Category category) {
        if (category == null) return "";
        Category parent = category.getParent();

        if (parent == null) {
            return category.getName();
        }

        return deriveCategoryPath(parent) + "/" + category.getName();
    }

    private static @NotNull CategorySummary toCategorySummary(Category c) {
        var thumbnail = c.getThumbnail() != null
                ? String.format("/api/v1/public/categories/thumbnail?id=%s", c.getThumbnail().getImageId())
                : null;
        return new CategorySummary(
                c.getCategoryId(),
                c.getName(),
                c.getCategoryStatus(),
                c.getCategoryLevel(),
                thumbnail
        );
    }

    private Category fetchCategory(UUID categoryId) {
        return categoryRepo.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(HttpStatus.NOT_FOUND, "Category not found: " + categoryId));
    }

    private Category fetchParentCategory(UUID parentId) {
        return categoryRepo.findById(parentId)
                .orElseThrow(() -> new ParentCategoryNotFoundException(HttpStatus.NOT_FOUND, "Parent category not found: " + parentId));
    }
}
