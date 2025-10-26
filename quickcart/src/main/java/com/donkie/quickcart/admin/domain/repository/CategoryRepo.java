package com.donkie.quickcart.admin.domain.repository;

import com.donkie.quickcart.admin.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryRepo extends JpaRepository<Category, UUID> {
}
