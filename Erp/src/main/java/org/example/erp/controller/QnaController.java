package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.service.QnaService;
import org.example.erp.service.UsersService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/qna")
public class QnaController {
    private final QnaService qnaService;
    private final UsersService usersService;



    // 큐엔에이 등록 매핑

    // 큐엔에이 수정 매핑

    // 큐엔에이 삭제 매핑

}
