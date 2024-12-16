package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.AnswersDto;
import org.example.erp.dto.QuestionsDto;
import org.example.erp.entity.Answers;
import org.example.erp.entity.Questions;
import org.example.erp.service.AnswersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/answers")
public class AnswersController {
    private final AnswersService answersService;


    // 질문 전체 리스트 불러오기 기능
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionsDto>> getAllQuestions() {
        List<QuestionsDto> questions = answersService.findAllQuestions();
        return ResponseEntity.ok(questions);
    }

    // 질문 답변 리스트 불러오기 기능
    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<AnswersDto>> getAnswersByQuestionId(@PathVariable Long questionId) {
        List<AnswersDto> answers = answersService.findByQuestionId(questionId);
        return ResponseEntity.ok(answers);
    }

    // 질문 상세페이지
    @GetMapping("/question/{id}/details")
    public ResponseEntity<?> getQuestionById(@PathVariable Long id) {
        QuestionsDto byIdQuestions = this.answersService.findByIdQuestions(id);

        return ResponseEntity.ok(byIdQuestions);
    }

    // 질문 생성 로직
    @PostMapping("/question")
    public ResponseEntity<String> createQuestion(@RequestBody QuestionsDto questionsDto) {
        boolean b = answersService.saveQuestions(questionsDto);
        if (!b) {
            return  ResponseEntity.badRequest().build();
        }
        // TODO: 카프카 메시지 보내기
        return ResponseEntity.status(200).body("질문 생성에 성공하였습니다.");
    }

    // 질문 변경 로직
    @PutMapping("/question/{id}")
    public ResponseEntity<String> updateQuestion(@PathVariable Long id, @RequestBody QuestionsDto questionsDto) {
        answersService.updateQuestions(questionsDto);

        return ResponseEntity.ok("질문 변경이 완료되었습니다.");
    }

    // 질문 삭제 로직
    @DeleteMapping("/question/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        answersService.deleteQuestions(id);
        return ResponseEntity.noContent().build();
    }

    // 답변 생성 로직
    @PostMapping("/answer")
    public ResponseEntity<Answers> createAnswer(@RequestBody Answers answers) {
        Answers createdAnswer = answersService.saveAnswers(answers);
        // TODO: 카프카 메시지 보내기
        return ResponseEntity.status(201).body(createdAnswer);
    }

    // 답변 변경 로직
    @PutMapping("/answer/{id}")
    public ResponseEntity<Answers> updateAnswer(@PathVariable Long id, @RequestBody Answers answers) {
        answers.setId(id);  // 수정할 답변 ID 설정
        Answers updatedAnswer = answersService.updateAnswers(answers);
        return ResponseEntity.ok(updatedAnswer);
    }

    // 답변 삭제 로직
    @DeleteMapping("/answer/{id}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long id) {
        answersService.deleteAnswers(id);
        return ResponseEntity.noContent().build();
    }

}
