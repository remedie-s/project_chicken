package org.example.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.dto.KafkaProductMessage;
import org.example.backend.entity.Products;
import org.example.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.search.ProductDocument;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.example.backend.search.ProductDocument.fromEntity;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final UsersRepository usersRepository;
    //엘라스틱서치용 리포지토리
    private final ProductsSearchRepository productsSearchRepository;
    private final CartsRepository cartsRepository;
    private final OrdersRepository ordersRepository;
    //TODO 생각해봐야함 굳이 넣어야할까
    private final DiscountPolicyRepository discountPolicyRepository;
    private final ProductReviewsRepository productReviewsRepository;

    /**
     * 키워드 기반 검색
     */
    public List<ProductDocument> searchProductsByKeyword(String keyword) {
        return productsSearchRepository.findByNameContaining(keyword);
    }

    /**
     * 카테고리 검색
     */
    public List<ProductDocument> searchProductsByCategory(String category) {
        return productsSearchRepository.findByCategory(category);
    }

    /**
     * 가격 범위 검색
     */
    public List<ProductDocument> searchProductsByPriceRange(Double minPrice, Double maxPrice) {
        return productsSearchRepository.findByPriceBetween(minPrice, maxPrice);
    }

    /**
     * 키워드와 카테고리 조합 검색
     */
    public List<ProductDocument> searchProductsByCategoryAndKeyword(String category, String keyword) {
        return productsSearchRepository.findByCategoryAndNameContaining(category, keyword);
    }

    /**
     * 여러 카테고리 검색
     */
    public List<ProductDocument> searchProductsByCategories(List<String> categories) {
        return productsSearchRepository.findByCategoryIn(categories);
    }

    /**
     * 가격 범위와 카테고리 조합 검색
     */
    public List<ProductDocument> searchProductsByCategoryAndPriceRange(String category, Double minPrice, Double maxPrice) {
        return productsSearchRepository.findByCategoryAndPriceBetween(category, minPrice, maxPrice);
    }

    /**
     * 재고량 기준 검색
     */
    public List<ProductDocument> searchProductsByStockGreaterThanOrEqual(Long stock) {
        return productsSearchRepository.findByStockGreaterThanEqual(stock);
    }

    public List<ProductDocument> searchProductsByStockLessThan(Long stock) {
        return productsSearchRepository.findByStockLessThan(stock);
    }

    /**
     * 판매량 기준 정렬된 검색 (페이징 지원)
     */
    public Page<ProductDocument> getTopSellingProducts(Pageable pageable) {
        return productsSearchRepository.findAllByOrderBySellCountDesc(pageable);
    }

    /**
     * 복잡한 쿼리를 사용한 검색
     */
    public List<ProductDocument> searchProductsByCustomQuery(String keyword, Double minPrice, Double maxPrice) {
        return productsSearchRepository.findByNameAndPriceRange(keyword, minPrice, maxPrice);
    }

    /**
     * 페이징 및 정렬 지원 키워드 검색
     */
    public Page<ProductDocument> searchProductsByKeywordPaged(String keyword, Pageable pageable) {
        return productsSearchRepository.findByNameContaining(keyword, pageable);
    }

    @KafkaListener(topics = "product-changes", groupId = "shopping-mall")
    public void listenProductChanges(String message) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            KafkaProductMessage productMessage = objectMapper.readValue(message, KafkaProductMessage.class);

            switch (productMessage.getAction()) {
                case "register":
                    registerProductToElasticsearch(productMessage.toEntity());
                    break;

                case "update":
                    updateProductInElasticsearch(productMessage.toEntity());
                    break;

                case "delete":
                    deleteProductFromElasticsearch(productMessage.toEntity());
                    break;

                default:
                    log.warn("Unknown action: {}", productMessage.getAction());
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to parse Kafka message: {}", message, e);
        }
    }
    public void registerProductToElasticsearch(Products products) {
        ProductDocument productDocument = fromEntity(products);
        productsSearchRepository.save(productDocument);
    }

    // Elasticsearch에서 물품 업데이트
    public void updateProductInElasticsearch(Products products) {
        ProductDocument productDocument = fromEntity(products);
        productsSearchRepository.save(productDocument);
    }

    // Elasticsearch에서 물품 삭제
    public void deleteProductFromElasticsearch(Products products) {
        productsSearchRepository.deleteById(products.getId());
    }

    // 물품 구매로직(즉시)

    // 물품 구매 로직(장바구니로 이동)

    // 물품 리뷰 리스트 (물품 상세페이지)

    // 물품 리뷰 작성 로직

    // 물품 리뷰 변경 로직

    // 물품 리뷰 삭제 로직

    
}
