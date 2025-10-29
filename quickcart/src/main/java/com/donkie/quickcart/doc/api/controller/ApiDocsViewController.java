package com.donkie.quickcart.doc.api.controller;

import com.donkie.quickcart.doc.api.dto.ApiCategoryResponse;
import com.donkie.quickcart.doc.application.service.ApiCategoryService;
import com.donkie.quickcart.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/docs")
@RequiredArgsConstructor
@Slf4j
public class ApiDocsViewController {

    private final ApiCategoryService service;

    // "/docs" - All endpoints starting with URI "/docs/**" are public
    @GetMapping
    public String docs() {
        return "apidoc";
    }

    // "/docs/fetch"
    @GetMapping("/fetch")
    public ResponseEntity<ApiResponse<List<ApiCategoryResponse>>> list() {
        log.debug("Attempting to list categories");
        List<ApiCategoryResponse> all = service.getAllDocs();
        return ResponseEntity.ok(ApiResponse.success("Categories fetched", all));
    }
}
