package com.donkie.quickcart.seller.infra.service;

import com.donkie.quickcart.seller.application.dto.request.ProductRequest;
import com.donkie.quickcart.seller.application.dto.response.ProductResponse;
import com.donkie.quickcart.seller.application.dto.response.ProductVariantResponse;
import com.donkie.quickcart.seller.application.events.ProductDeletedEvent;
import com.donkie.quickcart.seller.application.exception.CategoryDoesNotExistsException;
import com.donkie.quickcart.seller.application.exception.ProductNotFoundException;
import com.donkie.quickcart.seller.application.exception.StoreNotFoundException;
import com.donkie.quickcart.seller.application.service.contracts.ProductService;
import com.donkie.quickcart.seller.application.service.contracts.ProductVariantService;
import com.donkie.quickcart.seller.domain.model.Product;
import com.donkie.quickcart.seller.domain.model.Store;
import com.donkie.quickcart.seller.domain.repository.ProductRepository;
import com.donkie.quickcart.seller.domain.repository.StoreRepository;
import com.donkie.quickcart.seller.infra.integration.admin.CategoryClient;
import com.donkie.quickcart.user.domain.model.UserRole;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.donkie.quickcart.shared.security.util.CurrentUser.doesUserHasRole;
import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.ensureOwnership;
import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.isOwner;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryClient categoryClient;
    private final ProductVariantService productVariantService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    @Override
    public UUID createProduct(UUID storeId, UUID categoryId, ProductRequest request) {
        var categorySnapshot = categoryClient.getCategorySnapshot(categoryId)
                .orElseThrow(() -> new CategoryDoesNotExistsException(HttpStatus.INTERNAL_SERVER_ERROR, "Category path not found for category: " + categoryId));

        Store store = storeRepository.findActiveById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(HttpStatus.NOT_FOUND, "Store not found by Id: " + storeId));

        Product product = Product.builder()
                .title(request.title())
                .description(request.description())
                .brand(request.brand())
                .categoryId(categoryId)
                .categoryPath(categorySnapshot.path())
                .store(store)
                .build();

        productRepository.save(product);
        return product.getProductId();
    }

    @Transactional
    @Override
    public ProductResponse updateProduct(UUID productId, ProductRequest request) {
        var product = getIfValidOwnerAndNotDeleted(productId);

        product.setTitle(request.title());
        product.setDescription(request.description());
        product.setBrand(request.brand());
        productRepository.save(product);

        List<ProductVariantResponse> variants = productVariantService.getVariantsByProduct(productId);

        return toProductResponse(product, variants);
    }

    /**
     * Get product by ID and ensure it belongs to the current user or is active.
     */
    @Transactional(readOnly = true)
    @Override
    public ProductResponse getProduct(UUID productId) {
        Product product = null;
        var productNotFound = new ProductNotFoundException(HttpStatus.NOT_FOUND, "Product not found by Id: " + productId);
        if (doesUserHasRole(UserRole.SELLER)) {
            // If seller return all - exclude deleted
            product = productRepository.findByIdIfNonDeleted(productId)
                    .filter(p -> isOwner(p.ownerId()))
                    .orElseThrow(() -> productNotFound);
        } else {
            // If not, seller return all - exclude deleted and inactive
            product = productRepository.findActiveById(productId).orElseThrow(() -> productNotFound);
        }

        if(product != null) {
            List<ProductVariantResponse> variants = productVariantService.getVariantsByProduct(productId);
            return toProductResponse(product, variants);
        } else throw productNotFound;
    }

    @Transactional
    @Override
    public void deleteProduct(UUID productId) {
        var product = getIfValidOwnerAndNotDeleted(productId);

        product.getLifecycleAudit().setDeleted(true);
        product.getLifecycleAudit().setActive(false);

        productRepository.save(product);
        eventPublisher.publishEvent(new ProductDeletedEvent(productId));
    }

    @Override
    public List<ProductResponse> searchProducts(String searchQuery, int page, int size) {
        // TODO: Must configure DB for search support first
        return List.of();
    }

    @Transactional
    @Override
    public void publishProduct(UUID productId) {
        var product = getIfValidOwnerAndNotDeleted(productId);
        product.getLifecycleAudit().setActive(true);
        product.getVariants().forEach(pv -> pv.getLifecycleAudit().setActive(true));
        productRepository.save(product);
        // variant updates are cascaded
    }

    // ===================== Private Helpers =====================

    private @NotNull Product getIfValidOwnerAndNotDeleted(UUID productId) {
        var product = productRepository.findByIdIfNonDeleted(productId)
                .orElseThrow(() -> new ProductNotFoundException(HttpStatus.NOT_FOUND, "Product not found by Id: " + productId));
        ensureOwnership(product.ownerId());
        return product;
    }

    private static @NotNull ProductResponse toProductResponse(Product product, List<ProductVariantResponse> variants) {
        return new ProductResponse(
                product.getProductId(),
                product.getTitle(),
                product.getDescription(),
                product.getBrand(),
                product.getCategoryPath(),
                product.getAvgRating(),
                product.getRatingCount(),
                product.getLifecycleAudit().getCreatedDate(),
                product.getLifecycleAudit().getLastModifiedDate(),
                variants,
                product.isActive(),
                product.getLifecycleAudit().isDeleted()
        );
    }
}
