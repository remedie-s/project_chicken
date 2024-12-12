package org.example.erp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.messaging.FirebaseMessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.KafkaProductMessage;
import org.example.erp.entity.Orders;
import org.example.erp.repository.OrdersRepository;
import org.example.erp.repository.ProductsRepository;
import org.example.erp.repository.UsersRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class OrdersService {
    private final OrdersRepository ordersRepository;
    private final ProductsRepository productsRepository;
    private final UsersRepository usersRepository;
    private final FirebaseService firebaseService;

    // 주문 관리 메소드

    // 주문 전체리스트 보기 메소드
    public List<Orders> findAll() {
        return ordersRepository.findAll();
    }
    // 주문 리스트(고객아이디) 보기 메소드
    public List<Orders> findByUserId(Long userId) {
        return this.ordersRepository.findByUsers_id(userId);
    }

    // 주문 리스트(물품) 보기 메소드
    public List<Orders> findByProductId(Long productId) {
        return this.ordersRepository.findByProducts_Id(productId);
    }

    // 주문 상태 변경 메소드(반품도)
    public boolean modify(Long orderId,Orders orders) throws FirebaseMessagingException {
        Optional<Orders> byId = this.ordersRepository.findById(orderId);
        if (byId.isPresent()) {
            Orders orders1 = byId.get();
            orders1.setInvoice(orders.getInvoice());
            orders1.setStatus(orders.getStatus());

            this.ordersRepository.save(orders1);
            if(orders1.getStatus().equals("접수")){
                firebaseService.sendPushNotificationUser(orders.getUsers().getId(),"주문 접수 알람",
                        "주문이 접수되었습니다.");
            } else if (orders1.getStatus().equals("발송")) {
                firebaseService.sendPushNotificationUser(orders.getUsers().getId(),"주문 발송 알람",
                        "주문을 발송되었습니다.");

            } else if (orders1.getStatus().equals("도착")) {
                firebaseService.sendPushNotificationUser(orders.getUsers().getId(),"주문 도착 알람",
                        "주문이 도착하였습니다.");

            } else if (orders1.getStatus().equals("완료")) {
                firebaseService.sendPushNotificationUser(orders.getUsers().getId(),"주문 완료 알람",
                        "주문이 완료되었습니다.");

            }


            log.info("{} : modify orders success", orders1.getId());
            return true;
        }
        log.info("{} : modify orders fail", orders.getId());
        return false;
    }

    // 주문 삭제 메소드
    public boolean delete(Long orderId) {
        Optional<Orders> byId = this.ordersRepository.findById(orderId);
        if (byId.isPresent()) {
            Orders orders1 = byId.get();
            this.ordersRepository.delete(orders1);
            log.info("{} : delete orders success", orders1.getId());
            return true;
        }
        log.info("{} : delete orders fail", orderId);
        return false;

    }
//    // 카프카 리스너
//    @KafkaListener(topics = "Order-Confirm", groupId = "order-service-group")
//    public void listenProductChanges(String message) {
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//            KafkaProductMessage productMessage = objectMapper.readValue(message, KafkaProductMessage.class);
//            log.info("{} : listen Order-Confirm success", productMessage.getId());
//
//
//        } catch (JsonProcessingException e) {
//            log.error("Failed to parse Kafka message: {}", message, e);
//        }
//    }


    public Orders findById(Long orderId) {
        Optional<Orders> byId = this.ordersRepository.findById(orderId);
        if (byId.isPresent()) {
            return byId.get();
        }
        log.info("{} : find orders fail", orderId);
        return null;
    }
}
