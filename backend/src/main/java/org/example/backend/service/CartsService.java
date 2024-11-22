package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.repository.CartsRepository;
import org.example.backend.repository.DiscountPolicyRepository;
import org.example.backend.repository.OrdersRepository;
import org.example.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartsService {
    private final CartsRepository cartsRepository;
    private final OrdersRepository ordersRepository;
    private final UsersRepository usersRepository;
    private final DiscountPolicyRepository discountPolicyRepository;

    // 카트 리스트 보기 메소드
    
    // 카트 변경 메소드
    
    // 카트 삭제 메소드
    
    // 카트에서 주문 하기 메소드
    //TODO KAFKA 주문시 카프카로 메시지
    


}
