package com.donkie.quickcart.seller.application.service.contracts;

import com.donkie.quickcart.seller.application.dto.request.ProductRequest;
import com.donkie.quickcart.seller.application.dto.response.ProductResponse;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    UUID createProduct(UUID storeId, UUID categoryId, ProductRequest request);

    ProductResponse updateProduct(UUID productId, ProductRequest request);

    ProductResponse getProduct(UUID productId);

    void deleteProduct(UUID productId);

    List<ProductResponse> searchProducts(String searchQuery, int page, int size);

}
