package com.donkie.quickcart.seller.infra.integration.admin;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryClient {

    Optional<CategorySnapshot> getCategorySnapshot(UUID categoryId);

    List<CategorySummary> getCategorySummaryByName(List<String> names);
}
