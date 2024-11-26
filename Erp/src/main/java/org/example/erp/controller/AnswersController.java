package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.service.AnswersService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/answers")
public class AnswersController {
    private final AnswersService answersService;

    //질문 전체 리스트 불러오기 기능

    //질문 답변 리스트 불러오기 기능

    //질문 상세페이지

    //답변 리스트 불러오기기능(상세페이지에서)

    //TODO 질문 생성로직(관리자 필요한가?) - 질문 생성되면 카프카로 경고 넣을지 정해야함

    //TODO 질문 변경로직? 질문 상태를 엔티티에 추가하고 완료버튼 누르면 작동하는 로직? 구매자 측에서 생성해서 카프카로 메시지

    //질문 삭제로직

    //TODO 답변 생성로직 답변 생성시 구매자에게 카프카로 메시지

    //답변 변경로직

    //답변 삭제로직

}
