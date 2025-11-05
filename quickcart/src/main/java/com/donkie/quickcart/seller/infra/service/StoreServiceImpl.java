package com.donkie.quickcart.seller.infra.service;

import com.donkie.quickcart.seller.application.dto.request.StoreWrite;
import com.donkie.quickcart.seller.application.dto.response.StoreDetails;
import com.donkie.quickcart.seller.application.events.StoreDeletedEvent;
import com.donkie.quickcart.seller.application.exception.StoreNotFoundException;
import com.donkie.quickcart.seller.application.service.contracts.ProductService;
import com.donkie.quickcart.seller.application.service.contracts.StoreService;
import com.donkie.quickcart.seller.domain.model.Store;
import com.donkie.quickcart.seller.domain.repository.StoreRepository;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.donkie.quickcart.shared.security.util.CurrentUser.getCurrentUserId;
import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.ensureOwnership;
import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.isOwner;

@Service
@AllArgsConstructor
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final ProductService productService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    @Override
    public UUID createStore(StoreWrite write) {
        var store = Store.builder()
                .name(write.name())
                .location(write.location())
                .contactNumber(write.contactNumber())
                .email(write.email())
                .about(write.about())
                .build();

        storeRepository.save(store);
        return store.getStoreId();
    }

    @Transactional
    @Override
    public StoreDetails updateStore(UUID storeId, StoreWrite write) {
        var store = getStoreIfOwner(storeId);

        mapToExistingStore(write, store);
        storeRepository.save(store);

        return toStoreDetails(store);
    }

    @Transactional(readOnly = true)
    @Override
    public StoreDetails getStoreDetails(UUID storeId) {
        return storeRepository.findById(storeId)
                .filter(st -> st.isActive() || isOwner(st.ownerId()))
                .map(this::toStoreDetails)
                .orElseThrow(() -> new StoreNotFoundException(HttpStatus.NOT_FOUND, "Store not found by ID: " + storeId));
    }

    @Transactional
    @Override
    public void deleteStore(UUID storeId) {
        var store = getStoreIfOwner(storeId);

        store.getLifecycleAudit().setDeleted(true);
        store.getLifecycleAudit().setActive(false);

        storeRepository.save(store);
        // Event orphans all products related to store (isOrphan = true).
        eventPublisher.publishEvent(new StoreDeletedEvent(store.getStoreId()));
    }

    @Override
    public List<StoreDetails> getAllStores() {
        return getCurrentUserId().map(userId -> {
            List<Store> stores = storeRepository.findByLifecycleAudit_CreatedBy(userId.toString());
            return stores.stream()
                    .map(this::toStoreDetails)
                    .toList();
        }).orElseThrow(() -> new StoreNotFoundException(HttpStatus.NOT_FOUND, "No user found to retrieve stores"));
    }

    private @NotNull Store getStoreIfOwner(UUID storeId) {
        var store = storeRepository.findActiveById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(HttpStatus.NOT_FOUND, "Store not found by Id: " + storeId));

        // validate ownership, and only allow if the user owns the resource
        ensureOwnership(store.getLifecycleAudit().getCreatedBy());
        return store;
    }

    private void mapToExistingStore(StoreWrite write, Store store) {
        store.setName(write.name());
        store.setLocation(write.location());
        store.setContactNumber(write.contactNumber());
        store.setEmail(write.email());
        store.setAbout(write.about());
    }

    private @NotNull StoreDetails toStoreDetails(Store store) {
        return new StoreDetails(
                store.getStoreId(),
                store.getName(),
                store.getLocation(),
                store.getContactNumber(),
                store.getEmail(),
                store.getAbout(),
                store.getLifecycleAudit().getCreatedDate(),
                store.getLifecycleAudit().getLastModifiedDate()
        );
    }
}
