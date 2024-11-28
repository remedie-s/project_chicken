package org.example.erp.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.erp.entity.Partner;
import org.example.erp.entity.Products;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 파트너관리시 사용하는 DTO
 */
@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerDto {
    private Long id;
    // 파트너사 이름
    private String name;
    // 파트너사 이메일
    private String email;
    // 파트너사 담당자 이름
    private String managerName;
    // 파트너사 핸드폰
    private String phone;
    // 파트너사 주소
    private String address;
    // 파트너사 웹사이트
    private String website;
    // 파트너사 내용 ex) 관계하고있는 분야
    private String description;
    // 미수금
    private Long outstanding;
    // 협력 시작일
    private LocalDateTime contactStart;
    // 협력 마무리일
    private LocalDateTime contactEnd;

    // Partner -> PartnerDto 변환
    public static PartnerDto toDto(Partner partner) {
        if (partner == null) {
            return null;
        }
        return new PartnerDto(
                partner.getId(),
                partner.getName(),
                partner.getEmail(),
                partner.getManagerName(),
                partner.getPhone(),
                partner.getAddress(),
                partner.getWebsite(),
                partner.getDescription(),
                partner.getOutstanding(),
                partner.getContactStart(),
                partner.getContactEnd()
        );
    }

    // PartnerDto -> Partner 변환
    public static Partner toEntity(PartnerDto partnerDto) {
        if (partnerDto == null) {
            return null;
        }
        Partner partner = new Partner();
        partner.setId(partnerDto.getId());
        partner.setName(partnerDto.getName());
        partner.setEmail(partnerDto.getEmail());
        partner.setManagerName(partnerDto.getManagerName());
        partner.setPhone(partnerDto.getPhone());
        partner.setAddress(partnerDto.getAddress());
        partner.setWebsite(partnerDto.getWebsite());
        partner.setDescription(partnerDto.getDescription());
        partner.setOutstanding(partnerDto.getOutstanding());
        partner.setContactStart(partnerDto.getContactStart());
        partner.setContactEnd(partnerDto.getContactEnd());
        return partner;
    }
}
