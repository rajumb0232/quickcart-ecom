package com.donkie.quickcart.doc.api.controller;

import com.donkie.quickcart.doc.api.dto.ApiEndpointDetail;
import com.donkie.quickcart.doc.api.dto.ApiEndpointRequest;
import com.donkie.quickcart.doc.api.dto.ApiEndpointSummary;
import com.donkie.quickcart.doc.application.service.ApiEndpointService;
import com.donkie.quickcart.doc.domain.model.HttpMethod;
import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@Controller
@RequestMapping("/api/v1/docs")
@RequiredArgsConstructor
@Slf4j
public class ApiEndpointController {

    private final ApiEndpointService service;

    @PostMapping("/api-categories/{categoryId}/api-endpoints")
    public ResponseEntity<ApiAck> create(@PathVariable UUID categoryId,
                                         @RequestBody @Valid ApiEndpointRequest request) {
        UUID id = service.createEndpointDoc(categoryId, request);
        return ResponseEntity
                .created(URI.create("/api/v1/docs/categories/" + categoryId + "/endpoints/" + id))
                .body(ApiAck.success("Endpoint created successfully"));
    }

    @PutMapping("/api-endpoints/{endpointId}")
    public ResponseEntity<ApiResponse<ApiEndpointSummary>> update(@PathVariable UUID endpointId,
                                                                  @RequestBody @Valid ApiEndpointRequest request) {
        ApiEndpointSummary summary = service.updateEndpointDoc(endpointId, request);
        return ResponseEntity.ok(ApiResponse.success("API Endpoint Updated.", summary));
    }

    @PatchMapping("/api-endpoints/{endpointId}/method")
    public ResponseEntity<ApiResponse<ApiEndpointSummary>> updateEndpointMethod(
            @PathVariable UUID endpointId,
            @RequestParam("value") HttpMethod methodType
    ) {
        ApiEndpointSummary summary = service.updateEndpointMethod(endpointId, methodType);
        return ResponseEntity.ok(ApiResponse.success("API Endpoint Method Updated.", summary));
    }

    @PatchMapping("/api-endpoints/{endpointId}/title")
    public ResponseEntity<ApiResponse<ApiEndpointSummary>> updateEndpointTitle(
            @PathVariable UUID endpointId,
            @RequestParam("value") String title
    ) {
        ApiEndpointSummary summary = service.updateEndpointTitle(endpointId, title);
        return ResponseEntity.ok(ApiResponse.success("API Endpoint Title Updated.", summary));
    }

    @PatchMapping("/api-endpoints/{endpointId}/display-order")
    public ResponseEntity<ApiResponse<ApiEndpointSummary>> updateEndpointDisplayOrder(
            @PathVariable UUID endpointId,
            @RequestParam("value") Integer displayOrder
    ) {
        ApiEndpointSummary summary = service.updateEndpointDisplayOrder(endpointId, displayOrder);
        return ResponseEntity.ok(ApiResponse.success("API Endpoint Display Order Updated.", summary));
    }

    @DeleteMapping("/api-endpoints/{endpointId}")
    public ResponseEntity<ApiAck> delete(@PathVariable UUID endpointId) {
        service.deleteEndpointDoc(endpointId);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(ApiAck.success("Endpoint deleted successfully"));
    }

    @GetMapping("/api-endpoints/{endpointId}")
    public ResponseEntity<ApiResponse<ApiEndpointDetail>> get(@PathVariable UUID endpointId) {
        ApiEndpointDetail detail = service.getEndpointDoc(endpointId);
        return ResponseEntity.ok(ApiResponse.success("Endpoint Fetched", detail));
    }
}
