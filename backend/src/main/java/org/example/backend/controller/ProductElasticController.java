package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.service.ProductElasticsearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/elastic")
public class ProductElasticController {

    @Autowired
    private ProductElasticsearchService productElasticsearchService;

    // 모든 새로운 상품만 색인
    @GetMapping("/index-all")
    public ResponseEntity<String> indexNewProductsToElasticsearch() {
        try {
            productElasticsearchService.indexNewProducts();
            return ResponseEntity.ok("All new products indexed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to index products");
        }
    }

    @GetMapping("/index/{productId}")
    public ResponseEntity<String> indexSingleProduct(@PathVariable Long productId) {
        try {
            productElasticsearchService.indexProductById(productId);
            return ResponseEntity.ok("Product with ID " + productId + " indexed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to index product with ID " + productId);
        }
    }

}
