package org.example.backend.utility;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.KafkaProductMessage;
import org.example.backend.dto.KafkaProductReviewMessage;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Products;
import org.example.backend.entity.ProductReviews;
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
                    .stock(orders.getProducts().getStock()) // 현재 재고
                    .address(orders.getAddress()) // 배송 주소
                    .userId(orders.getUsers().getId()) // 유저 ID
                    .build();

            // JSON으로 변환
            String message = objectMapper.writeValueAsString(orderMessage);
            log.info("{} : 주문을 완료했어요 메시지입니다.",message);
            // Kafka에 전송
            kafkaTemplate.send("Order-Confirm", message);
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
                    .stock(products.getStock())
                    .build();

            String message = objectMapper.writeValueAsString(productMessage);
            log.info("{} : 물품 수량이 낮아요 메시지입니다.",message);
            kafkaTemplate.send("Out-of-Stock", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize Kafka message", e);
        }
    }
    // 물품 리뷰 관련 카프카 메시지 별점 일정 이하시 발송
    public void sendKafkaProductReviewMsg(ProductReviews productsReviews, String action) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            KafkaProductReviewMessage productReviewMessage = KafkaProductReviewMessage.builder()
                    .action(action)
                    .id(productsReviews.getId())
                    .content(productsReviews.getContent())
                    .userId(productsReviews.getUsers().getId())
                    .rating(productsReviews.getRating())
                    .productId(productsReviews.getProducts().getId())
                    .build();

            String message = objectMapper.writeValueAsString(productReviewMessage);
            log.info("{} : 별점이 낮아요 메시지입니다.",message);
            kafkaTemplate.send("Low-Rating", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize Kafka message", e);
        }
    }
}
