package com.donkie.quickcart.seller.application.service.contracts;

import com.donkie.quickcart.seller.application.dto.request.ProductVariantRequest;
import com.donkie.quickcart.seller.application.dto.response.ProductByVariantResponse;
import com.donkie.quickcart.seller.application.dto.response.ProductVariantResponse;

import java.util.List;
import java.util.UUID;

public interface ProductVariantService {

    ProductVariantResponse createProductVariant(UUID productId, ProductVariantRequest request);

    ProductVariantResponse updateProductVariant(UUID variantId, ProductVariantRequest request);

    void deleteProductVariant(UUID variantId);

    List<ProductVariantResponse> getVariantsByProduct(UUID productId);

    ProductByVariantResponse getProductByVariant(UUID variantId);
}
