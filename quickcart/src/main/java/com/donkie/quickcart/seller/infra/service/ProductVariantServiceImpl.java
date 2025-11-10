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
import com.donkie.quickcart.shared.security.util.CurrentUser;
import com.donkie.quickcart.user.domain.model.UserRole;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
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
    public ProductVariantResponse createProductVariant(UUID productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
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
        return toResponse(variant, resolveImageURIs(variant));
    }

    @Transactional
    @Override
    public ProductVariantResponse updateProductVariant(UUID variantId, ProductVariantRequest request) {
        // All edit to non deleted, ignoring the active status
        var variant = getIfNotDeletedAndIsOwner(variantId);

        variant.setTitle(request.title());
        variant.setPrice(request.price());
        variant.setQuantity(request.quantity());
        variant.setDescription(request.description());
        variant.setAttributes(request.attributes());

        productVariantRepository.save(variant);
        return toResponse(variant, resolveImageURIs(variant));
    }

    @Transactional
    @Override
    public void deleteProductVariant(UUID variantId) {
        // All delete to actives
        var variant = getIfNotDeletedAndIsOwner(variantId);

        variant.getLifecycleAudit().setDeleted(true);
        variant.getLifecycleAudit().setActive(false);
        productVariantRepository.save(variant);
    }

    /**
     * Get product by ID and ensure it belongs to the current user or is active.
     */
    @Transactional(readOnly = true)
    @Override
    public List<ProductVariantResponse> getVariantsByProduct(UUID productId) {
        List<ProductVariant> variants = null;

        if (CurrentUser.doesUserHasRole(UserRole.SELLER)) {
            // If Seller - return all variants excluding deleted
            variants = productVariantRepository.findAllByProductIfNonDeleted(productId);
        } else {
            // If not seller - then return all variants excluding deleted and inactive
            variants = productVariantRepository.findAllActiveByProduct(productId);
        }

        return variants.stream()
                .map(v -> {
                    var imageURIs = resolveImageURIs(v);
                    return toResponse(v, imageURIs);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    @Override
    public ProductVariantResponse getVariant(UUID variantId) {
        return productVariantRepository.findById(variantId)
                .map(v -> toResponse(v, resolveImageURIs(v)))
                .orElseThrow(() -> new ProductVariantNotFoundException(HttpStatus.NOT_FOUND, "Product not found by variant ID: " + variantId));
    }

    // ======================== Private Helpers ========================

    private static @NotNull Set<String> resolveImageURIs(ProductVariant v) {
        return v.getImages().stream().map(img -> "/public/products/variants/images/" + img.getImageId())
                .collect(Collectors.toSet());
    }

    private @NotNull ProductVariant getIfNotDeletedAndIsOwner(UUID variantId) {
        ProductVariant variant = productVariantRepository.findByIdIfNonDeleted(variantId)
                .orElseThrow(() -> new ProductVariantNotFoundException(HttpStatus.NOT_FOUND, "ProductVariant not found by Id: " + variantId));

        ensureOwnership(variant.getLifecycleAudit().getCreatedBy());
        return variant;
    }

    private ProductVariantResponse toResponse(ProductVariant v, Set<String> imageURIs) {
        return new ProductVariantResponse(
                v.getVariantId(),
                v.getTitle(),
                v.getPrice(),
                v.getQuantity(),
                v.getDescription(),
                v.getLifecycleAudit().getCreatedDate(),
                v.getLifecycleAudit().getLastModifiedDate(),
                v.getAttributes(),
                imageURIs,
                v.isActive(),
                v.getLifecycleAudit().isDeleted()
        );
    }
}
