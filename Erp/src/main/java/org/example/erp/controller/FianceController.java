package org.example.erp.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.FianceDto;
import org.example.erp.entity.Employee;
import org.example.erp.entity.Fiance;
import org.example.erp.service.FianceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/fiance")
public class FianceController {
    private final FianceService fianceService;

    // 모든 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드
    @GetMapping("/all")
    public ResponseEntity<?> getAll(@AuthenticationPrincipal Employee employee) {
        //TODO 노동자 계급 구분
        if(employee == null){
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }
        Map<String, Long> all = this.fianceService.findAll();
        return ResponseEntity.ok(all);

    }

    // 기간 집어넣고 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드
    @GetMapping("/date")
    public ResponseEntity<?> getDate(@AuthenticationPrincipal Employee employee,
                                     @RequestParam("startDate") String startDateStr,
                                     @RequestParam("endDate") String endDateStr) {
        if (employee == null) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }

        if (startDateStr == null || endDateStr == null) {
            return ResponseEntity.status(400).body("시작일과 마감일이 비었습니다.");
        }

        try {
            // 월일만 요청이 넘어올때 강제로 시간을 00시 00분 00초로 수정함
            LocalDateTime startDate = LocalDate.parse(startDateStr).atStartOfDay();
            LocalDateTime endDate = LocalDate.parse(endDateStr).atStartOfDay();

            if (startDate.isAfter(endDate)) {
                return ResponseEntity.status(400).body("시작일이 마감일보다 늦을 수 없습니다.");
            }

            Map<String, Long> allByDate = this.fianceService.findAllByDate(startDate, endDate);
            return ResponseEntity.ok(allByDate);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("날짜 형식이 잘못되었습니다.");
        }
    }

    // 카테고리 집어넣고 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드
    @GetMapping("/cate")
    public ResponseEntity<?> getCate(@AuthenticationPrincipal Employee employee,

                                     @RequestParam("category") String category) {
        if (employee == null) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }

        if (category == null ) {
            return ResponseEntity.status(400).body("카테고리가 비어있습니다.");
        }

        Map<String, Long> allByDate = this.fianceService.findAllByCate(category);
        return ResponseEntity.ok(allByDate);

    }


    // 디비에 들어있는 현재 회사 내부 재산 추출하는 메소드(더미데이터 입력해놓은것)
    @GetMapping("/inner")
    public ResponseEntity<?> getInner(@AuthenticationPrincipal Employee employee) {
        if (employee == null) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }
        List<FianceDto> all = this.fianceService.all();
        return ResponseEntity.ok(all);
    }

    // 내부재산 입력 메소드
    @PostMapping("/inner/create")
    public ResponseEntity<?> createInner(@AuthenticationPrincipal Employee employee,@RequestBody @Valid FianceDto fianceDto) {
        if (employee == null) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }
        this.fianceService.create(fianceDto);
        List<FianceDto> all = this.fianceService.all();
        return ResponseEntity.ok(all);
    }

    // 내부재산 제거 메소드
    @DeleteMapping("/inner/{innerId}")
    public ResponseEntity<?> deleteInner(@AuthenticationPrincipal Employee employee,@PathVariable("innerId") Long innerId) {
        if (employee == null) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }
        this.fianceService.delete(innerId);
        List<FianceDto> all = this.fianceService.all();
        return ResponseEntity.ok(all);
    }

    // 내부재산 수정 메소드
    @PutMapping("/inner/{innerId}")
    public ResponseEntity<?> updateInner(@AuthenticationPrincipal Employee employee,@PathVariable("innerId") Long innerId,@RequestBody @Valid FianceDto fianceDto) {
        if (employee == null) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }
        this.fianceService.update(fianceDto);
        List<FianceDto> all = this.fianceService.all();
        return ResponseEntity.ok(all);
    }


}
