package org.example.erp.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.EmployeeDto;
import org.example.erp.entity.Employee;
import org.example.erp.repository.EmployeeRepository;
import org.example.erp.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    // 직원 리스트조회
    @GetMapping("/list")
    public ResponseEntity<?> getEmployee() {
        List<EmployeeDto> allToEmployee = this.employeeService.findAllToEmployee();
        return ResponseEntity.ok(allToEmployee);
    }
    // 직원 부서별 리스트 조회

    // 직원 리스트조회(임원, 인사과)
    @GetMapping("/list/ex")
    public ResponseEntity<?> getEmployeeByEX(@AuthenticationPrincipal Employee employee ) {
        //TODO 권한 체크 메소드 만들어야함
        if(employee==null){
            log.info("{}",employee);
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(this.employeeService.findAll());
    }

    // 직원 상세페이지
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getEmployeeDetail(@PathVariable("id") Long id) {
        EmployeeDto byIdToEmployee = this.employeeService.findByIdToEmployee(id);
        return ResponseEntity.ok(byIdToEmployee);
    }

    // 직원 상세페이지(임원, 인사과)
    @GetMapping("/admin/{id}")
    public ResponseEntity<?> getAdminDetail(@PathVariable("id") Long id) {
        EmployeeDto byId = this.employeeService.findById(id);
        return ResponseEntity.ok(byId);
    }

    // 직원 변경
    @PostMapping("/modify/{id}")
    public ResponseEntity<?> modifyEmployee(@PathVariable("id") Long id, @RequestBody EmployeeDto employeeDto) {
        return null;
    }


    // 추가로직

}
