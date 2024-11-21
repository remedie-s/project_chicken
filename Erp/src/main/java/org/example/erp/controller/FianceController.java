package org.example.erp.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.service.FianceService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/fiance")
public class FianceController {
    private final FianceService fianceService;

    // 모든 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드

    // 기간 집어넣고 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드

    // 카테고리 집어넣고 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드

    // 디비에 들어있는 현재 회사 내부 재산 추출하는 메소드(더미데이터 입력해놓은것)

    // 내부재산 입력 메소드

    // 내부재산 제거 메소드

    // 내부재산 수정 메소드


}
