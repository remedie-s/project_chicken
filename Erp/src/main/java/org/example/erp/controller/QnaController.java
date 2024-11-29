package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.Qna;
import org.example.erp.service.QnaService;
import org.example.erp.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/qna")
public class QnaController {
    private final QnaService qnaService;

    // 큐엔에이 등록 매핑
    @PostMapping
    public ResponseEntity<?> createQna(@RequestBody Qna qna) {
        log.info("큐엔에이 등록 요청: {}", qna);
        Qna savedQna = qnaService.save(qna);
        return ResponseEntity.ok(savedQna);
    }

    // 큐엔에이 수정 매핑
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQna(@PathVariable Long id, @RequestBody Qna qna) {
        log.info("큐엔에이 수정 요청: ID={}, Data={}", id, qna);
        qna.setId(id); // 경로로 받은 ID를 Qna 엔티티에 설정
        boolean modified = qnaService.modify(qna);
        if (modified) {
            return ResponseEntity.ok("QnA updated successfully");
        }
        return ResponseEntity.badRequest().body("QnA update failed");
    }

    // 큐엔에이 삭제 매핑
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQna(@PathVariable Long id) {
        log.info("큐엔에이 삭제 요청: ID={}", id);
        boolean deleted = qnaService.delete(id);
        if (deleted) {
            return ResponseEntity.ok("QnA deleted successfully");
        }
        return ResponseEntity.badRequest().body("QnA delete failed");
    }

    // 큐엔에이 전체 조회 매핑
    @GetMapping
    public ResponseEntity<List<Qna>> getAllQna() {
        log.info("큐엔에이 전체 조회 요청");
        List<Qna> qna = qnaService.findAll();
        return ResponseEntity.ok(qna);
    }

    // 큐엔에이 상세 조회 매핑
    @GetMapping("/{id}")
    public ResponseEntity<?> getQnaById(@PathVariable Long id) {
        log.info("큐엔에이 상세 조회 요청: ID={}", id);
        Qna qna = qnaService.findById(id);
        if (qna != null) {
            return ResponseEntity.ok(qna);
        }
        return ResponseEntity.badRequest().body("QnA not found");
    }
}