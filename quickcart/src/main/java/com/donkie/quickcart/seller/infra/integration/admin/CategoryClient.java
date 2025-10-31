package com.donkie.quickcart.seller.infra.integration.admin;

import java.util.Optional;
import java.util.UUID;

public interface CategoryClient {

    Optional<CategorySnapshot> getCategorySnapshot(UUID categoryId);
}
