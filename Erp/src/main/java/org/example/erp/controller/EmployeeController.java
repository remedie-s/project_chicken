package org.example.erp.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.repository.EmployeeRepository;
import org.example.erp.service.EmployeeService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    // 직원 리스트조회

    // 직원 부서별 리스트 조회

    // 직원 리스트조회(임원, 인사과)

    // 직원 상세페이지

    // 직원 상세페이지(임원, 인사과)

    // 직원 가입

    // 직원 변경

    // 추가로직

}
