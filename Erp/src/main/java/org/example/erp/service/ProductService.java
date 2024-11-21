package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.DiscountPolicy;
import org.example.erp.repository.DiscountPolicyRepository;
import org.example.erp.repository.EventRepository;
import org.example.erp.repository.ProductsRepository;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProductService {
    private final ProductsRepository productsRepository;
    private final DiscountPolicyRepository discountPolicyRepository;
    private final EventRepository eventRepository;
    // 물품 리스트 로직
    // 물품 카테고리 로직
    // 물품 등록 로직
    // 물품 상세페이지 로직
    // 물품 변경로직
    
}
