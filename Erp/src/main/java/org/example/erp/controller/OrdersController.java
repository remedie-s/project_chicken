package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.Orders;
import org.example.erp.service.OrdersService;
import org.example.erp.service.UsersService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    private final OrdersService ordersService;
    private final UsersService usersService;

    // 주문 관리 메소드

    // 주문 전체리스트 보기 메소드


    // 주문 리스트(고객아이디) 보기 메소드

    // 주문 리스트(물품) 보기 메소드

    // 주문 상태 변경 메소드

    // 주문 삭제 메소드

    //TODO 반품 관련 로직을 만들것인가?

}
