package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.repository.FianceRepository;
import org.example.erp.repository.OrdersRepository;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FianceService {
    private final FianceRepository fianceRepository;
    private final OrdersRepository ordersRepository;

    // 모든 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드

    // 기간 집어넣고 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드

    // 카테고리 집어넣고 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드

    // 디비에 들어있는 현재 회사 내부 재산 추출하는 메소드(더미데이터 입력해놓은것)

    // 내부재산 입력 메소드

    // 내부재산 제거 메소드

    // 내부재산 수정 메소드

}
