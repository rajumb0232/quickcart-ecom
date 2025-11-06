package com.donkie.quickcart.seller.application.service.contracts;

import com.donkie.quickcart.seller.application.dto.request.ProductFilters;
import com.donkie.quickcart.seller.application.dto.request.ProductRequest;
import com.donkie.quickcart.seller.application.dto.response.ProductResponse;
import com.donkie.quickcart.shared.dto.PageContainer;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    UUID createProduct(UUID storeId, UUID categoryId, ProductRequest request);

    ProductResponse updateProduct(UUID productId, ProductRequest request);

    ProductResponse getProduct(UUID productId);

    void deleteProduct(UUID productId);

    List<ProductResponse> searchProducts(String searchQuery, int page, int size);

    void publishProduct(UUID productId);

    List<ProductResponse> getProductsByFilter(ProductFilters filters, int page, int size);

    List<String> getBrands();

    PageContainer<ProductResponse> getProductsByStore(UUID storeId, int page, int size);
}
