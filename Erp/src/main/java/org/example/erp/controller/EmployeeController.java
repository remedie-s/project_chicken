package org.example.erp.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.EmployeeDto;
import org.example.erp.entity.Employee;
import org.example.erp.repository.EmployeeRepository;
import org.example.erp.service.EmployeeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    // 직원 리스트조회
    @GetMapping("/list")
    public List<EmployeeDto> getEmployee() {
        List<EmployeeDto> allToEmployee = this.employeeService.findAllToEmployee();
        return allToEmployee;
    }
    // 직원 부서별 리스트 조회

    // 직원 리스트조회(임원, 인사과)
    @GetMapping("/list/ex")
    public List<EmployeeDto> getEmployeeByEX(@AuthenticationPrincipal Employee user ) {
        //TODO 권한 체크 메소드 만들어야함
        log.info("{}",user);
        return this.employeeService.findAll();
    }

    // 직원 상세페이지

    // 직원 상세페이지(임원, 인사과)

    // 직원 변경

    // 추가로직

}
