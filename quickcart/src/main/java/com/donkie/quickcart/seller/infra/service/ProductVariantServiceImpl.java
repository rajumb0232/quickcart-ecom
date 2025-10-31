package com.donkie.quickcart.seller.infra.service;

import com.donkie.quickcart.seller.application.dto.request.ProductVariantRequest;
import com.donkie.quickcart.seller.application.dto.response.ProductVariantResponse;
import com.donkie.quickcart.seller.application.exception.ProductNotFoundException;
import com.donkie.quickcart.seller.application.exception.ProductVariantNotFoundException;
import com.donkie.quickcart.seller.application.service.contracts.ProductVariantService;
import com.donkie.quickcart.seller.domain.model.Product;
import com.donkie.quickcart.seller.domain.model.ProductVariant;
import com.donkie.quickcart.seller.domain.repository.ProductRepository;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import com.donkie.quickcart.seller.domain.repository.StoreRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.ensureOwnership;

@Service
@AllArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;

    @Transactional
    @Override
    public UUID createProductVariant(UUID productId, ProductVariantRequest request) {
        Product product = productRepository.findActiveById(productId)
                .orElseThrow(() -> new ProductNotFoundException(HttpStatus.NOT_FOUND, "Product not found by Id: " + productId));

        ensureOwnership(product.getLifecycleAudit().getCreatedBy());

        ProductVariant variant = ProductVariant.builder()
                .title(request.title())
                .price(request.price())
                .quantity(request.quantity())
                .description(request.description())
                .attributes(request.attributes())
                .product(product)
                .build();

        productVariantRepository.save(variant);

        return variant.getVariantId();
    }

    @Transactional
    @Override
    public void updateProductVariant(UUID variantId, ProductVariantRequest request) {
        ProductVariant variant = productVariantRepository.findActiveById(variantId)
                .orElseThrow(() -> new ProductVariantNotFoundException(HttpStatus.NOT_FOUND, "ProductVariant not found by Id: " + variantId));

        ensureOwnership(variant.getLifecycleAudit().getCreatedBy());

        variant.setTitle(request.title());
        variant.setPrice(request.price());
        variant.setQuantity(request.quantity());
        variant.setDescription(request.description());
        variant.setAttributes(request.attributes());

        productVariantRepository.save(variant);
    }

    @Transactional
    @Override
    public void deleteProductVariant(UUID variantId) {
        ProductVariant variant = productVariantRepository.findActiveById(variantId)
                .orElseThrow(() -> new ProductVariantNotFoundException(HttpStatus.NOT_FOUND, "ProductVariant not found by Id: " + variantId));

        ensureOwnership(variant.getLifecycleAudit().getCreatedBy());

        variant.getLifecycleAudit().setDeleted(true);
        variant.getLifecycleAudit().setActive(false);
        productVariantRepository.save(variant);
    }

    @Transactional(readOnly = true)
    @Override
    public List<ProductVariantResponse> getVariantsByProduct(UUID productId) {
        List<ProductVariant> variants = productVariantRepository.findAllActiveByProduct(productId);

        return variants.stream()
                .map(this::toResponse)
                .toList();
    }

    private ProductVariantResponse toResponse(ProductVariant v) {
        return new ProductVariantResponse(
                v.getVariantId(),
                v.getTitle(),
                v.getPrice(),
                v.getQuantity(),
                v.getDescription(),
                v.getAttributes(),
                v.getLifecycleAudit().getCreatedDate(),
                v.getLifecycleAudit().getLastModifiedDate()
        );
    }
}
