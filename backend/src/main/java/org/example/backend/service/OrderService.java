package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.OrdersDto;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Users;
import org.example.backend.repository.CartsRepository;
import org.example.backend.repository.OrdersRepository;
import org.example.backend.repository.UsersRepository;
import org.example.backend.utility.KafkaMessage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrdersRepository ordersRepository;
    private final UsersRepository usersRepository;
    private final KafkaMessage kafkaMessage;

    // 주문 목록보기
    public List<OrdersDto> ordersList(Users user) {
        List<Orders> byUsersId = this.ordersRepository.findByUsers_Id((user.getId()));
        List<OrdersDto> ordersDtos = new ArrayList<>();
        for (Orders order : byUsersId) {
            if(order.isAvailable()) {
                OrdersDto ordersDto = order.toDto();
                ordersDtos.add(ordersDto);
            }
        }
        return ordersDtos;
    }
    // 숨긴 주문 목록보기
    public List<OrdersDto> ordersListHide(Users user) {
        List<Orders> byUsersId = this.ordersRepository.findByUsers_Id((user.getId()));
        List<OrdersDto> ordersDtos = new ArrayList<>();
        for (Orders order : byUsersId) {
            if(!order.isAvailable()) {
                OrdersDto ordersDto = order.toDto();
                ordersDtos.add(ordersDto);
            }
        }
        return ordersDtos;
    }


    // 주문 숨기기
    public boolean hideOrder(Users user, Long orderId) {
        Optional<Orders> byId = this.ordersRepository.findById(orderId);
        if (byId.isPresent()) {
            Orders order = byId.get();
            order.setAvailable(!order.isAvailable()); // 상태를 토글
            this.ordersRepository.save(order);
            log.info("{}번 주문의 숨김 처리가 변경 되었습니다.", order.getId());
            return true;
        }
        else {
            log.error("{}번 주문이 없어요", orderId);
            return false;
        }


    }

    //반품
    public boolean refundOrder(Long orderId) {
        Optional<Orders> byId = this.ordersRepository.findById(orderId);
        if (byId.isPresent()) {
            Orders order = byId.get();
            if (order.getStatus() == null) {
                log.error("주문 상태가 없습니다. 반품 신청 실패.");
                return false;
            }
            order.setStatus("반품 신청");
            this.ordersRepository.save(order);
            log.info("{}번 주문의 반품 신청이 접수되었습니다.", orderId);
            this.kafkaMessage.sendKafkaOrderMsg(order, "refund");
            return true;
        } else {
            log.error("{}번 주문이 존재하지 않습니다.", orderId);
            return false;
        }
    }

    // 주문 하나 특정
    public Orders findById(Long orderId) {
        Optional<Orders> byId = this.ordersRepository.findById(orderId);
        if (byId.isPresent()) {
            return byId.get();
        }
        else {
            return null;
        }
    }
}
