package org.example.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    // 전화번호
    private String phoneNumber;
    // 부서
    private String department;
    // 직급
    private String position;
    // 연봉
    private Long salary;
    // 인센티브
    private Long incentive;
    // 고용일
    private LocalDateTime hireDate;
    // 사퇴일
    private LocalDateTime resignationDate;
    // 연가 남아있는 날짜
    private double annualLeave;
    // 근무 평점(100점 만점)
    private Integer rating;
    // 근퇴 여부 테이블과 연결
    // 근태와의 관계 (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.REMOVE)
    private List<Attendance> attendances;
    


}
