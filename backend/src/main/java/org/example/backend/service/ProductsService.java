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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.search.ProductDocument;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

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
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final String TOPIC_ALERT = "Out of Stock"; // 카프카 주제
    private final String TOPIC_ORDER = "Order Confirm"; // 카프카 주제

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
    public boolean buyInstance(OrdersDto ordersDto, Users users) {
        Optional<Products> byId = this.productsRepository.findById(ordersDto.getId());
        if (byId.isPresent()) {
            //TODO logic 제한 로직 넣어야함 ex 스톡보다 구매량이 많을시 이걸 프론트에서 막고 한번더 막아야함
            if(byId.get().getStock()<ordersDto.getQuantity()) {
                log.info("{}번 상품의 수량이 재고량보다 적습니다.",ordersDto.getProducts().getId());
                return false;
            }
            log.info("Buying order {} for user {}", ordersDto.getId(), users.getId());
            Orders orders = new Orders();
            orders.setProducts(byId.get());
            orders.setPrice(ordersDto.getPrice());
            // 디스카운트를 여기서 ? 아니면 다른데서?
            orders.setDiscount(ordersDto.getDiscount());
            orders.setPayPrice(ordersDto.getPayPrice());
            orders.setCreatedAt(LocalDateTime.now());
            orders.setAvailable(false);
            orders.setAddress(ordersDto.getAddress());
            orders.setUsers(users);
            this.ordersRepository.save(orders);
            //TODO Kafka 카프카로 물품 수량 부족 메시지 보내야함(물품 수량이 작다면) 10개이하시
            if(orders.getProducts().getStock()<=10){
                log.info("{}번 물품 부족으로 인하여 알림 발송",orders.getProducts().getId());
                sendKafkaProductMsg(orders.getProducts(),"alert");
            }
            //TODO Kafka 카프카로 주문 접수 메시지 보내야
            sendKafkaOrderMsg(orders, "order");
            return true;




        }
        log.info("{}번 물품이 현재 없습니다.","ordersDto.getProducts().getId()");
        return false;

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



    // 물품 리뷰 리스트 (물품 상세페이지)

    // 물품 리뷰 작성 로직

    // 물품 리뷰 변경 로직

    // 물품 리뷰 삭제 로직





    // 주문 관련 카프카 메시지
    private void sendKafkaOrderMsg(Orders orders, String action) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Kafka 메시지에 포함할 데이터를 빌드
            KafkaProductMessage orderMessage = KafkaProductMessage.builder()
                    .action(action) // "order" 같은 행동 유형 지정
                    .id(orders.getId()) // 주문 ID
                    .name(orders.getProducts().getName()) // 상품 이름
                    .description(orders.getProducts().getDescription()) // 상품 설명
                    .price(orders.getProducts().getPrice()) // 상품 가격
                    .category(orders.getProducts().getCategory()) // 상품 카테고리
                    .imageUrl(orders.getProducts().getImageUrl()) // 상품 이미지 URL
                    .stock(orders.getProducts().getStock()) // 현재 재고
                    .brand(orders.getProducts().getBrand()) // 상품 브랜드
                    .cost(orders.getProducts().getCost()) // 상품 원가
                    .discount(orders.getDiscount()) // 할인 정보
                    .payPrice(orders.getPayPrice()) // 결제 가격
                    .address(orders.getAddress()) // 배송 주소
                    .userId(orders.getUsers().getId()) // 유저 ID
                    .createdAt(orders.getCreatedAt()) // 주문 생성 시간
                    .build();

            // JSON으로 변환
            String message = objectMapper.writeValueAsString(orderMessage);
            // Kafka에 전송
            kafkaTemplate.send(TOPIC_ORDER, message);
            log.info("Kafka order message sent: {}", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize order message", e);
        }
    }

    // 물품 관련 카프카 메시지
    private void sendKafkaProductMsg(Products products,String action) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            KafkaProductMessage productMessage = KafkaProductMessage.builder()
                    .action(action)
                    .id(products.getId())
                    .name(products.getName())
                    .description(products.getDescription())
                    .price(products.getPrice())
                    .category(products.getCategory())
                    .imageUrl(products.getImageUrl())
                    .stock(products.getStock())
                    .brand(products.getBrand())
                    .cost(products.getCost())
                    .build();

            String message = objectMapper.writeValueAsString(productMessage);
            kafkaTemplate.send(TOPIC_ALERT, message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize Kafka message", e);
        }
    }
    
}
