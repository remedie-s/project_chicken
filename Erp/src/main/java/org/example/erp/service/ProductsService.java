package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.repository.*;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final DiscountPolicyRepository discountPolicyRepository;
    private final EventRepository eventRepository;
    private final InventoryAlertRepository inventoryAlertRepository;
    private final ProductReviewsRepository productReviewsRepository;
    

    // 물품 리스트 로직

    // 물품 카테고리별 리스트 로직

    //TODO 물품 등록 로직(엘라스틱서치 색인도 동시에 진행)

    // 물품 상세페이지 로직

    //TODO 물품 검색 로직(엘라스틱 서치 이용)

    //TODO 물품 수량 낮음 경고(카프카)- 수신쪽으로 봐야할듯? 구매완료시 쇼핑몰 서버에서 카프카로 메시지 보내면 여기서 받아서 진행하는 로직 - 경고 서비스로 따로 뺄지 생각중

    // 물품 변경로직(수량)

    // 물품 삭제로직

    // 물품 구매로직(직접구매) - 쇼핑몰 서버에서 구현 주문들어옴 경고(카프카)

    // 물품 구매로직(장바구니로 이동)  - 쇼핑몰 서버에서 구현 주문들어옴 경고(카프카)
    
    //TODO 물품 리뷰 관리 로직 (삭제 ? 아니면 여기에 답글 달기 기능 추가 여부?) 물품 리뷰가 들어오면 경고 이벤트?
    
}
