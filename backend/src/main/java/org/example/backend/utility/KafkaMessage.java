package org.example.backend.utility;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.KafkaProductMessage;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Products;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Slf4j
@Service
public class KafkaMessage {
    private final KafkaTemplate<String, String> kafkaTemplate;
    // 주문 관련 카프카 메시지
    public void sendKafkaOrderMsg(Orders orders, String action) {
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
            kafkaTemplate.send("Order Confirm", message);
            log.info("Kafka order message sent: {}", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize order message", e);
        }
    }

    // 물품 관련 카프카 메시지
    public void sendKafkaProductMsg(Products products, String action) {
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
            kafkaTemplate.send("Out of Stock", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize Kafka message", e);
        }
    }
}
