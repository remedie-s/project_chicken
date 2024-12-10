package org.example.erp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.messaging.FirebaseMessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.example.erp.dto.KafkaProductMessage;
import org.example.erp.dto.KafkaProductReviewMessage;
import org.example.erp.entity.Role;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;
    private final FirebaseService firebaseService;

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
        try {
            String title = "New Order Received";
            String body = "You have received a new order with ID: " + orderMessage.getId();
            // 예시: 관리자에게 알림을 보낸다.
            firebaseService.sendPushNotificationToRole(Role.MANAGER, title, body);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send push notification for order message", e);
        }
    }

    // 물품 메시지 처리
    private void handleProductMessage(KafkaProductMessage productMessage) {
        log.info("Handling product message: {}", productMessage);
        try {
            String title = "Out of Stock Alert";
            String body = "Product " + productMessage.getName() + " is out of stock.";
            // 예시: 재고 관련 알림을 관리자에게 보낸다.
            firebaseService.sendPushNotificationToRole(Role.PURCHASING, title, body);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send push notification for product message", e);
        }
    }

    // 리뷰 메시지 처리
    private void handleProductReviewMessage(KafkaProductReviewMessage reviewMessage) {
        log.info("Handling product review message: {}", reviewMessage);
        try {
            String title = "New Product Low Review";
            String body = "Product " + reviewMessage.getProducts().getName() + " has received a new review with rating: " + reviewMessage.getRating();
            // 예시: 리뷰 관련 알림을 관리자에게 보낸다.
            firebaseService.sendPushNotificationToRole(Role.CUSTOMER_SERVICE, title, body);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send push notification for review message", e);
        }
    }
}
