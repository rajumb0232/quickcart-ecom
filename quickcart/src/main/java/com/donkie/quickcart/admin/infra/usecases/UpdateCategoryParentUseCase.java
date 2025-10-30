package com.donkie.quickcart.admin.infra.usecases;

import com.donkie.quickcart.admin.application.dto.response.CategorySummary;
import com.donkie.quickcart.admin.application.exception.CategoryLevelOutOfRangeException;
import com.donkie.quickcart.admin.application.exception.CyclicalCategoryMappingException;
import com.donkie.quickcart.admin.domain.model.Category;
import com.donkie.quickcart.admin.domain.repository.CategoryRepo;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class UpdateCategoryParentUseCase {
    private final CategoryRepo categoryRepo;

    @Transactional
    public CategorySummary execute(Category newParent, Category category) {
        if (category.getParent() == null && category.getChild().isEmpty())
            return assignParent(newParent, category);

        // Ensure newParent is not within the subtree of category to avoid cycles.
        if (isDescendantOf(newParent, category))
            throw new CyclicalCategoryMappingException(HttpStatus.BAD_REQUEST, "Invalid parent assignment: parent is a descendant of the category");

        return assignParent(newParent, category);
    }

    private @NotNull CategorySummary assignParent(Category newParent, Category category) {
        assignParentAndUpdateHierarchy(newParent, category);
        Category saved = categoryRepo.save(category);
        return toCategorySummary(saved);
    }

    private static void assignParentAndUpdateHierarchy(Category parent, Category category) {
        var parentLevel = parent.getCategoryLevel();

        if (parentLevel == 3)
            throw new CategoryLevelOutOfRangeException(
                    HttpStatus.BAD_REQUEST,
                    "Suggested Parent Category with level 3 cannot have descendant categories."
            );

        if (canHaveParent(category)) {
            // Parent is not at level 3, and the category can have parent
            category.setCategoryLevel(parentLevel + 1);
            category.setParent(parent);

            /*
             * Now the category is either at level 2 or 3.
             * At Level 2, It might have one more descendant child group.
             * At Level 3, It will not have any descendant, hence empty will return true.
             * If in case the future allows Level 4 or more, a recursive call makes it future-proof.
             */
            if (!category.getChild().isEmpty()) {
                // At this point category at level 2, and child must be updated to level 3
                category.getChild().forEach(child -> assignParentAndUpdateHierarchy(category, child));
            }
        } else
            throw new CategoryLevelOutOfRangeException(HttpStatus.BAD_REQUEST, "Requested Category Cannot have parent while already having 2 nested descendants");

    }

    private static boolean canHaveParent(Category category) {
        // If a category already has a parent, then it can have a new parent too.
        if (category.getParent() != null) return true;

        // If the category doesn't have a parent, then the category is at level 1
        List<Category> childrenGroup1 = category.getChild();
        // If the Category at Level 1 has empty children, then it can have parent.
        if (childrenGroup1.isEmpty()) return true;

        /*
         * Now that Level 1 Category has a children, If any of the Child Category at Level 2
         * has descendants, then the category cannot have a parent.
         * Cause: Level 1 Category will be updated to Level 2 and Level 2 will be updated
         * to 3, and 3 attempts updating to 4 resulting in constraint violation exception.
         */
        for (Category child : childrenGroup1) {
            if (!child.getChild().isEmpty()) return false;
        }
        return true;
    }

    private boolean isDescendantOf(Category potentialDescendant, Category ancestor) {
        // BFS up from potentialDescendant towards root checking if we meet ancestor
        Category current = potentialDescendant;
        while (current != null) {
            if (current.getCategoryId().equals(ancestor.getCategoryId())) {
                return true;
            }
            current = current.getParent();
        }
        return false;
    }

    private static @NotNull CategorySummary toCategorySummary(Category c) {
        return new CategorySummary(
                c.getCategoryId(),
                c.getName(),
                c.getCategoryStatus(),
                c.getCategoryLevel(),
                c.getThumbnail().getImageId().toString());
    }
}
