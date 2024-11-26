package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.repository.OrdersRepository;
import org.example.erp.repository.ProductsRepository;
import org.example.erp.repository.UsersRepository;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class OrdersService {
    private final OrdersRepository ordersRepository;
    private final ProductsRepository productsRepository;
    private final UsersRepository usersRepository;

    // 주문 관리 메소드

    // 주문 전체리스트 보기 메소드

    // 주문 리스트(고객아이디) 보기 메소드

    // 주문 리스트(물품) 보기 메소드

    // 주문 상태 변경 메소드

    // 주문 삭제 메소드

    //TODO 반품 관련 로직을 만들것인가?



}
