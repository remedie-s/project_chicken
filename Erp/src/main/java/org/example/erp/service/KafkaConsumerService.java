package org.example.erp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.example.erp.dto.KafkaProductMessage;
import org.example.erp.dto.KafkaProductReviewMessage;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;

    // 주문 관련 메시지 수신
    @KafkaListener(topics = "Order-Confirm", groupId = "backend-consumer-group")
    public void consumeOrderMessage(ConsumerRecord<String, String> record) {
        try {
            String message = record.value();
            KafkaProductMessage orderMessage = objectMapper.readValue(message, KafkaProductMessage.class);
            log.info("Received Order Kafka message: {}", orderMessage);

            // 주문 메시지 처리 로직
            handleOrderMessage(orderMessage);
        } catch (Exception e) {
            log.error("Failed to process Order Kafka message", e);
        }
    }

    // 재고 관련 메시지 수신
    @KafkaListener(topics = "Out-of-Stock", groupId = "backend-consumer-group")
    public void consumeProductMessage(ConsumerRecord<String, String> record) {
        try {
            String message = record.value();
            KafkaProductMessage productMessage = objectMapper.readValue(message, KafkaProductMessage.class);
            log.info("Received Product Kafka message: {}", productMessage);

            // 재고 메시지 처리 로직
            handleProductMessage(productMessage);
        } catch (Exception e) {
            log.error("Failed to process Product Kafka message", e);
        }
    }

    // 리뷰 관련 메시지 수신
    @KafkaListener(topics = "Low-Rating", groupId = "backend-consumer-group")
    public void consumeProductReviewMessage(ConsumerRecord<String, String> record) {
        try {
            String message = record.value();
            KafkaProductReviewMessage reviewMessage = objectMapper.readValue(message, KafkaProductReviewMessage.class);
            log.info("Received Product Review Kafka message: {}", reviewMessage);

            // 리뷰 메시지 처리 로직
            handleProductReviewMessage(reviewMessage);
        } catch (Exception e) {
            log.error("Failed to process Product Review Kafka message", e);
        }
    }

    // 주문 메시지 처리
    private void handleOrderMessage(KafkaProductMessage orderMessage) {
        log.info("Handling order message: {}", orderMessage);
        // TODO: 주문 처리 로직 추가
    }

    // 물품 메시지 처리
    private void handleProductMessage(KafkaProductMessage productMessage) {
        log.info("Handling product message: {}", productMessage);
        // TODO: 물품 처리 로직 추가
    }

    // 리뷰 메시지 처리
    private void handleProductReviewMessage(KafkaProductReviewMessage reviewMessage) {
        log.info("Handling product review message: {}", reviewMessage);
        // TODO: 리뷰 처리 로직 추가
    }
}
