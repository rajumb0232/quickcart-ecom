package com.donkie.quickcart.doc.api.controller;

import com.donkie.quickcart.doc.api.dto.ApiCategoryResponse;
import com.donkie.quickcart.doc.application.service.ApiCategoryService;
import com.donkie.quickcart.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/docs")
@RequiredArgsConstructor
@Slf4j
public class ApiDocController {

    private final ApiCategoryService service;

    @GetMapping
    public String docs() {
        return "apidoc";
    }

    @GetMapping("/fetch")
    public ResponseEntity<ApiResponse<List<ApiCategoryResponse>>> list() {
        log.debug("Attempting to list categories");
        List<ApiCategoryResponse> all = service.getAllCategories(null, null);
        return ResponseEntity.ok(ApiResponse.success("Categories fetched", all));
    }
}
