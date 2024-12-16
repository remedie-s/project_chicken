package org.example.erp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.NoticeDto;
import org.example.erp.entity.Employee;
import org.example.erp.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notice")
public class NoticeController {
    private final NoticeService noticeService;



    // 공지사항 등록 메소드

    @PostMapping("/create")
    public ResponseEntity<?> create(@Valid @RequestBody NoticeDto noticeDto, @AuthenticationPrincipal Employee employee) {
        if(employee == null){
            return ResponseEntity.badRequest().build();
        }
        if(this.noticeService.noticeCreate(noticeDto)){
            return ResponseEntity.ok("공지사항 등록 성공");
        }
        return ResponseEntity.badRequest().build();
    }

    // 공지사항 수정 메소드
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @PutMapping("/modify")
    public ResponseEntity<?> update(@Valid @RequestBody NoticeDto noticeDto, @AuthenticationPrincipal Employee employee) {
        if(employee == null){
            return ResponseEntity.badRequest().build();
        }

        if(this.noticeService.noticeUpdate(noticeDto)){
            return ResponseEntity.ok("공지사항 수정 성공");
        }
        return ResponseEntity.badRequest().build();
    }

    // 공지사항 삭제 메소드
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable ("id") Long id) {
        if(this.noticeService.noticeDelete(id)){
            return ResponseEntity.ok("공지사항 삭제 성공");
        }
        return ResponseEntity.badRequest().build();

    }
    @GetMapping("/list/admin")
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(this.noticeService.findAll());
    }

    @GetMapping("/list")
    public ResponseEntity<?> listAdmin() {
        return ResponseEntity.ok(this.noticeService.findByType());
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.noticeService.findById(id));

    }


}
