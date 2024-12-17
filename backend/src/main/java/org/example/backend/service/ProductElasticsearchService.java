package org.example.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.Products;
import org.example.backend.repository.ProductsRepository;
import org.example.backend.repository.ProductsSearchRepository;
import org.example.backend.search.ProductDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Slf4j
@Service
public class ProductElasticsearchService {

    @Autowired
    private ProductsRepository productsRepository; // DB에서 상품 정보를 가져오는 repository

    @Autowired
    private ProductsSearchRepository productsSearchRepository; // Elasticsearch repository

    // 모든 상품을 Elasticsearch에 색인하는 메소드
    public void indexNewProducts() {
        List<Products> productsList = productsRepository.findAll(); // DB에서 모든 상품 조회

        // 상품 정보를 Elasticsearch에 색인
        for (Products product : productsList) {
            // Elasticsearch에 이미 해당 상품이 존재하는지 확인
            if (!productsSearchRepository.existsById(product.getId())) {
                ProductDocument productDocument = ProductDocument.fromEntity(product); // DB 엔티티를 Elasticsearch 문서로 변환
                productsSearchRepository.save(productDocument); // Elasticsearch에 색인
            } else {
                log.info("Product with ID {} already indexed in Elasticsearch", product.getId());
            }
        }
    }

    // 특정 상품을 Elasticsearch에 색인하는 메소드
    public void indexProductById(Long productId) {
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Elasticsearch에 이미 해당 상품이 존재하는지 확인
        if (!productsSearchRepository.existsById(product.getId())) {
            ProductDocument productDocument = ProductDocument.fromEntity(product); // DB 엔티티를 Elasticsearch 문서로 변환
            productsSearchRepository.save(productDocument); // Elasticsearch에 색인
        } else {
            log.info("Product with ID {} already indexed in Elasticsearch", product.getId());
        }
    }
}