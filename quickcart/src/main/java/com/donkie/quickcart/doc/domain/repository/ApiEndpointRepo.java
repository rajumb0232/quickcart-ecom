package com.donkie.quickcart.doc.domain.repository;

import com.donkie.quickcart.doc.domain.model.ApiEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ApiEndpointRepo extends JpaRepository<ApiEndpoint, UUID> {

    Optional<ApiEndpoint> findByEndpointIdAndCategory_CategoryId(UUID endpointId, UUID categoryId);
}
