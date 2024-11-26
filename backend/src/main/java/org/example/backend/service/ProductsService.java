package org.example.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.dto.CartsDto;
import org.example.backend.dto.KafkaProductMessage;
import org.example.backend.dto.OrdersDto;
import org.example.backend.dto.ProductsDto;
import org.example.backend.entity.Carts;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;
import org.example.backend.repository.*;
import org.example.backend.utility.KafkaMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.search.ProductDocument;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.example.backend.search.ProductDocument.fromEntity;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final UsersRepository usersRepository;
    //엘라스틱서치용 리포지토리

    private final CartsRepository cartsRepository;
    private final OrdersRepository ordersRepository;
    //TODO 생각해봐야함 굳이 넣어야할까
    private final DiscountPolicyRepository discountPolicyRepository;
    private final ProductReviewsRepository productReviewsRepository;
    private final ProductsSearchRepository productsSearchRepository;
    private final KafkaMessage kafkaMessage;


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

    // 브랜드 기반 검색
    public List<ProductDocument> searchProductsByBrand(String brand) {
        return productsSearchRepository.findByBrand(brand);
    }

    // 브랜드와 가격 범위 검색
    public List<ProductDocument> searchProductsByBrandAndPriceRange(String brand, Double minPrice, Double maxPrice) {
        return productsSearchRepository.findByBrandAndPriceBetween(brand, minPrice, maxPrice);
    }

    // 브랜드와 카테고리 검색
    public List<ProductDocument> searchProductsByBrandAndCategory(String brand, String category) {
        return productsSearchRepository.findByBrandAndCategory(brand, category);
    }

    // 판매량 기준 상위 브랜드 검색
    public Page<ProductDocument> getTopSellingProductsByBrand(String brand, Pageable pageable) {
        return productsSearchRepository.findByBrandOrderBySellCountDesc(brand, pageable);
    }

    // 브랜드와 키워드 검색
    public List<ProductDocument> searchProductsByBrandAndKeyword(String brand, String keyword) {
        return productsSearchRepository.findByBrandAndNameContaining(brand, keyword);
    }

    // 브랜드 목록 기반 검색
    public List<ProductDocument> searchProductsByBrands(List<String> brands) {
        return productsSearchRepository.findByBrandIn(brands);
    }

    // Elasticsearch에서 상품 추가
    public void registerProductToElasticsearch(Products products) {
        ProductDocument productDocument = ProductDocument.fromEntity(products);
        productsSearchRepository.save(productDocument);
    }

    // Elasticsearch에서 상품 업데이트
    public void updateProductInElasticsearch(Products products) {
        ProductDocument productDocument = ProductDocument.fromEntity(products);
        productsSearchRepository.save(productDocument);
    }

    // Elasticsearch에서 상품 삭제
    public void deleteProductFromElasticsearch(Products products) {
        productsSearchRepository.deleteById(products.getId());
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

    // 물품 구매로직(즉시) - 유저는 프린시팔에서 가져옴, 실패시 false 반환 성공시 true 반환
    @Transactional
    public boolean buyInstance(OrdersDto ordersDto, Users users) {
        // 1. 상품 조회
        Optional<Products> optionalProduct = productsRepository.findById(ordersDto.getId());
        if (optionalProduct.isEmpty()) {
            log.info("Product with ID {} does not exist.", ordersDto.getId());
            return false;
        }
        Products product = optionalProduct.get();

        // 2. 재고 확인
        if (product.getStock() < ordersDto.getQuantity()) {
            log.info("Insufficient stock for product ID {}. Requested: {}, Available: {}",
                    product.getId(), ordersDto.getQuantity(), product.getStock());
            return false;
        }

        // 3. 주문 생성 및 저장
        Orders order = new Orders();
        order.setProducts(product);
        order.setUsers(users);
        order.setQuantity(ordersDto.getQuantity());
        order.setPrice(ordersDto.getPrice()); // 총 가격 계산
        order.setDiscount(ordersDto.getDiscount());
        order.setPayPrice(ordersDto.getPayPrice()); // 할인 적용
        order.setCreatedAt(LocalDateTime.now());
        order.setAvailable(false);
        order.setAddress(ordersDto.getAddress());
        ordersRepository.save(order);

        // 4. 재고 업데이트
        product.setStock(product.getStock() - ordersDto.getQuantity());
        productsRepository.save(product);

        // 5. 카프카 메시지 전송
        if (product.getStock() <= 10) {
            log.info("Low stock alert for product ID {}. Remaining stock: {}", product.getId(), product.getStock());
            this.kafkaMessage.sendKafkaProductMsg(product, "alert");
        }
        this.kafkaMessage.sendKafkaOrderMsg(order, "order");

        log.info("Order created successfully for user ID {} with product ID {}", users.getId(), product.getId());
        return true;
    }

    // 물품 구매 로직(장바구니로 이동) - 유저는 프린시팔에서 가져옴
    public boolean moveToCart(CartsDto cartsDto, Users users) {
        // 1. 상품 조회
        Optional<Products> productOpt = productsRepository.findById(cartsDto.getProductId());
        if (productOpt.isEmpty()) {
            log.warn("Product with ID {} not found", cartsDto.getProductId());
            return false;
        }
        Products product = productOpt.get();

        // 2. 사용자의 카트 목록에서 동일한 상품 존재 여부 확인
        List<Carts> userCarts = users.getCarts();
        if (!userCarts.isEmpty()) {
            for (Carts cart : userCarts) {
                if (cart.getProducts().getId().equals(product.getId())) {
                    // 동일 상품이 이미 있다면 수량 추가
                    cart.setQuantity(cart.getQuantity() + cartsDto.getQuantity());
                    cartsRepository.save(cart);
                    log.info("Updated cart for user {} with product {} (new quantity: {})",
                            users.getId(), product.getId(), cart.getQuantity());
                    return true;
                }
            }
        }

        // 3. 동일 상품이 없을 경우 새 카트 항목 생성
        Carts newCart = new Carts();
        newCart.setUsers(users); // 사용자 정보 설정
        newCart.setProducts(product); // 상품 정보 설정
        newCart.setQuantity(cartsDto.getQuantity()); // 수량 설정
        cartsRepository.save(newCart);
        log.info("Created new cart item for user {} with product {} (quantity: {})",
                users.getId(), product.getId(), cartsDto.getQuantity());
        return true;
    }



    //TODO 물품 리뷰 리스트 (물품 상세페이지)

    //TODO 물품 리뷰 작성 로직

    //TODO 물품 리뷰 변경 로직

    //TODO 물품 리뷰 삭제 로직






    
}
