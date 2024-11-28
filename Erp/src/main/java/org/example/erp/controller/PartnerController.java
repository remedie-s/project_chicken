package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.PartnerDto;
import org.example.erp.entity.Partner;
import org.example.erp.service.PartnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/partner")
public class PartnerController {

    private final PartnerService partnerService;
    // 모든 파트너 조회
    @GetMapping("/all")
    public ResponseEntity<List<Partner>> getAllPartners() {
        List<Partner> partners = partnerService.getAllPartners();
        return ResponseEntity.ok(partners);
    }

    // ID로 파트너 조회
    @GetMapping("/{id}")
    public ResponseEntity<Partner> getPartnerById(@PathVariable Long id) {
        return ResponseEntity.ok(partnerService.getPartnerById(id));
    }

    // 파트너 등록
    @PostMapping("/create")
    public ResponseEntity<Partner> createPartner(@RequestBody PartnerDto partnerDto) {
        Partner entity = PartnerDto.toEntity(partnerDto);
        Partner createdPartner = partnerService.createPartner(entity);
        return ResponseEntity.ok(createdPartner);
    }

    // 파트너 수정
    @PutMapping("/{id}")
    public ResponseEntity<Partner> updatePartner(@PathVariable Long id, @RequestBody PartnerDto partnerDto) {
        Partner entity = PartnerDto.toEntity(partnerDto);
        try {
            Partner updatedPartner = partnerService.updatePartner(id, entity);
            return ResponseEntity.ok(updatedPartner);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 파트너 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePartner(@PathVariable Long id) {
        partnerService.deletePartner(id);
        return ResponseEntity.noContent().build();
    }
}
