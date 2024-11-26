package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.repository.CartsRepository;
import org.example.backend.repository.OrdersRepository;
import org.example.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final CartsRepository cartsRepository;
    private final OrdersRepository ordersRepository;
    private final UsersRepository usersRepository;

    // 주문 목록보기

    // 주문 숨기기

    //TODO 주문 반품신청?
}
