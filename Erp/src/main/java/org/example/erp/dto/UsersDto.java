package org.example.erp.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.erp.entity.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 유저 관리시 사용하는 DTO
 */
@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UsersDto {
    private Long id;
    // 이름
    private String name;
    // 이메일
    private String email;
    // 비밀번호
    private String password;
    // 가입일(현재시간)
    private LocalDateTime createdAt;
    // 성별(남/여)
    private String gender;
    // 주소
    private String address;
    // 태어난 날 (나이를 받으려고했으나, 시간이 지남에따라 자동 계산해야하므로 변경)
    private LocalDate birthDate;
    // 유저 등급(기본 0~3)
    private Integer userGrade;
    // 구매 수량
    private Long totalPurchaseCount;
    // 구매 가격
    private Long totalPurchasePrice;
}