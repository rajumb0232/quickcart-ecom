package com.donkie.quickcart.admin.infra.usecases;

import com.donkie.quickcart.admin.application.dto.response.CategoryDetail;
import com.donkie.quickcart.admin.domain.model.Category;
import com.donkie.quickcart.admin.domain.model.CategoryStatus;
import com.donkie.quickcart.admin.domain.repository.CategoryRepo;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@AllArgsConstructor
public class GetCategoriesByStatusUseCase {
    private final CategoryRepo categoryRepo;

    @Transactional(readOnly = true)
    public @NotNull List<CategoryDetail> execute(List<CategoryStatus> allowedStatuses) {
        List<Category> all = categoryRepo.findAll(); // single DB query
        AllCategoriesWithRoots result = createMapOfAllCategories(all);

        // build DTO tree from the in-memory map (no further DB calls)
        List<CategoryDetail> finalList = new ArrayList<>(result.roots().size());
        for (Category root : result.roots()) {
            CategoryDetail detail = buildDetailFromMap(root, result.byParent(), allowedStatuses);
            if (detail != null) {
                finalList.add(detail);
            }
        }
        return finalList;
    }

    private AllCategoriesWithRoots createMapOfAllCategories(List<Category> all) {
        // group categories by parentId (null -> roots)
        Map<UUID, List<Category>> byParent = new HashMap<>(all.size());
        List<Category> roots = new ArrayList<>();

        for (Category c : all) {
            UUID parentId = (c.getParent() == null) ? null : c.getParent().getCategoryId();
            byParent.computeIfAbsent(parentId, k -> new ArrayList<>()).add(c);
            if (parentId == null) roots.add(c);
        }
        return new AllCategoriesWithRoots(byParent, roots);
    }

    private record AllCategoriesWithRoots(
            Map<UUID, List<Category>> byParent,
            List<Category> roots
    ) {
    }

    private CategoryDetail buildDetailFromMap(Category node, Map<UUID, List<Category>> byParent, List<CategoryStatus> allowedStatuses) {
        // If the node is inactive, skip the whole branch
        if (!allowedStatuses.contains(node.getCategoryStatus())) return null;

        // If the node has no children, return the node itself
        List<Category> children = byParent.getOrDefault(node.getCategoryId(), List.of());
        if (children.isEmpty()) {
            return toCategoryDetail(node, List.of());
        }

        // build child details
        List<CategoryDetail> childDetails = new ArrayList<>(children.size());
        for (Category ch : children) {
            CategoryDetail cd = buildDetailFromMap(ch, byParent, allowedStatuses);
            if (cd != null) childDetails.add(cd);
        }

        return toCategoryDetail(node, childDetails);
    }

    private static @NotNull CategoryDetail toCategoryDetail(Category node, List<CategoryDetail> childDetails) {
        var thumbnail = node.getThumbnail() != null
                ? String.format("/api/v1/public/categories/thumbnail?id=%s", node.getThumbnail().getImageId())
                : null;
        return new CategoryDetail(
                node.getCategoryId(),
                node.getName(),
                node.getCategoryStatus(),
                node.getCategoryLevel(),
                thumbnail,
                childDetails);
    }
}
