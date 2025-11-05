package com.donkie.quickcart.admin.domain.repository;

import com.donkie.quickcart.admin.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CategoryRepo extends JpaRepository<Category, UUID> {

    List<Category> findByParentIsNull();

    @Query("SELECT c FROM Category c WHERE LOWER(c.name) IN :names AND c.categoryStatus = 'ACTIVE'")
    List<Category> findActiveCategoriesByNamesLowerCase(@Param("names") List<String> names);

}
