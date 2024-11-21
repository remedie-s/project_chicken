package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.service.NoticeService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notice")
public class NoticeController {
    private final NoticeService noticeService;

    // 배너 등록 메소드

    // 배너 수정 메소드

    // 배너 삭제 메소드

    // 공지사항 등록 메소드

    // 공지사항 수정 메소드

    // 공지사항 삭제 메소드


}
