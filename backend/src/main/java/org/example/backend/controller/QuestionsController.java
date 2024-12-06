package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.patterns.TypePatternQuestions;
import org.example.backend.dto.QuestionsDto;
import org.example.backend.entity.Users;
import org.example.backend.service.QuestionsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/questions")
public class QuestionsController {
    private final QuestionsService questionsService;
    // 작성하신거 여기에 넣어주시면 됩니다.
    // 유저 문의 리스트
    @GetMapping("/list")
    public List<QuestionsDto> questionsList(@AuthenticationPrincipal Users users) {
        return this.questionsService.questionsList(users);
    }
    // 문의 작성
    @PostMapping("/create")
    public ResponseEntity<?> questionsCreate(@AuthenticationPrincipal Users users,
                                          @RequestBody @Valid QuestionsDto questionsDto) {
        if (this.questionsService.createQuestion(users, questionsDto)){
            return ResponseEntity.ok("작성 완료");
        }
        return ResponseEntity.status(500).body("문의 등록 오류입니다.");
    }
    // 문의 삭제
    @PostMapping("/delete/{id}")
    public ResponseEntity<?> questionsDelete(@AuthenticationPrincipal Users users,
                                              @PathVariable Long id) {
        if (this.questionsService.deleteQuestions(users, id)){
        return ResponseEntity.ok("삭제 완료");
    }
        return ResponseEntity.status(500).body("문의 삭제 오류입니다.");
    }
    //  문의 상세 조회
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> questionsDetail(@AuthenticationPrincipal Users users, @PathVariable Long id) {
        QuestionsDto questionsDto = questionsService.questionsDetail(users, id);
        if (questionsDto == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("해당 글에 접근할 권한이 없습니다.");
        }
        return ResponseEntity.ok(questionsDto);
    }
    // 문의 수정
    @PostMapping("/modify/{id}")
    public ResponseEntity<?> questionModify(@AuthenticationPrincipal Users users,
                                            @PathVariable Long id,
                                            @RequestBody @Valid QuestionsDto questionsDto
    ){
        if(this.questionsService.modifyQuestions(users, id, questionsDto)){
            return ResponseEntity.ok("문의 수정 성공");
        }
        return ResponseEntity.status(500).body("문의 수정 오류입니다.");
    }
}
