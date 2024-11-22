package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.service.PartnerService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/partner")
public class PartnerController {
    private final PartnerService partnerService;

    //파트너 리스트 보기 메소드

    // 파트너 상세보기 메소드

    // 파트너 생성 메소드

    // 파트너 수정 메소드

    // 파트너 삭제 메소드

}
