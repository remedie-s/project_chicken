package org.example.erp.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.ProductsDto;
import org.example.erp.entity.Employee;
import org.example.erp.service.ProductsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 물품 관리 컨트롤러
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/products")
public class ProductsController {
    private final ProductsService productsService;

    // 물품 등록
    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductsDto productsDto,
                                           HttpServletResponse response,
                                           @AuthenticationPrincipal Employee employee) {
        this.productsService.registerProduct(productsDto);

        return ResponseEntity.ok(productsDto);
    }
}
