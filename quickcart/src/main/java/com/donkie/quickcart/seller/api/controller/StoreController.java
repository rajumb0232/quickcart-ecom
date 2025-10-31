package com.donkie.quickcart.seller.api.controller;

import com.donkie.quickcart.seller.application.dto.request.StoreWrite;
import com.donkie.quickcart.seller.application.dto.response.StoreDetails;
import com.donkie.quickcart.seller.application.service.contracts.StoreService;
import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PostMapping("/stores")
    public ResponseEntity<ApiAck> createStore(@RequestBody @Valid StoreWrite request) {
        UUID id = storeService.createStore(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .location(URI.create("/api/v1/public/stores/" + id))
                .body(ApiAck.success("Store Created."));
    }

    @GetMapping("/public/stores/{storeId}")
    public ResponseEntity<ApiResponse<StoreDetails>> getStoreByIDForPublic(@PathVariable UUID storeId) {
        StoreDetails storeDetails = storeService.getStoreDetails(storeId);
        return ResponseEntity.ok(ApiResponse.success(
                "Store Found",
                storeDetails
        ));
    }

    @GetMapping("/stores/{storeId}")
    public ResponseEntity<ApiResponse<StoreDetails>> getStoreByID(@PathVariable UUID storeId) {
        StoreDetails storeDetails = storeService.getStoreDetails(storeId);
        return ResponseEntity.ok(ApiResponse.success(
                "Store Found",
                storeDetails
        ));
    }

    @PutMapping("/stores/{storeId}")
    public ResponseEntity<ApiResponse<StoreDetails>> updateStore(
            @PathVariable UUID storeId,
            @RequestBody @Valid StoreWrite request
    ) {
        StoreDetails storeDetails = storeService.updateStore(storeId, request);
        return ResponseEntity.ok(ApiResponse.success(
                "Store Updated",
                storeDetails
        ));
    }

    @DeleteMapping("/stores/{storeId}")
    public ResponseEntity<ApiAck> deleteStore(@PathVariable UUID storeId) {
        storeService.deleteStore(storeId);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(ApiAck.success("Store Deleted."));
    }
}
