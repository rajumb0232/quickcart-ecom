package com.donkie.quickcart.doc.domain.repository;

import com.donkie.quickcart.doc.domain.model.ApiCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ApiCategoryRepo extends JpaRepository<ApiCategory, UUID> {
}
