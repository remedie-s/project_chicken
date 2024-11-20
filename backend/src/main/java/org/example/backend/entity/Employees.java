package org.example.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

/**
 * 백엔드 서버를 2개로 만들어야해서 엔티티 미설정
 */
public class Employees {

    @Column(unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // AUTO_INCREMENT 설정
    private Long employeeId;
    //부서
    private String department;
    //직급
    private String rank;
    //입사일
    private LocalDate startDate;
    //퇴사일(비워져있어야함, 회원가입 메소드 구축시 고려)
    private LocalDate endDate;
    //급여
    private Long salary;
    //인센티브 급여
    private Long incentiveSalary;
    //평가 (회원가입시 비어있어야함)
    private String evaluation;





}
