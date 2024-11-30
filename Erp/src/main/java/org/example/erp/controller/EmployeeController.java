package org.example.erp.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.EmployeeDto;
import org.example.erp.entity.Attendance;
import org.example.erp.entity.Employee;
import org.example.erp.entity.Leave;
import org.example.erp.service.AttendanceService;
import org.example.erp.service.EmployeeService;
import org.example.erp.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final AttendanceService attendanceService;
    private final LeaveService leaveService;

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
            log.info("권한이 없어요");
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
        if(this.employeeService.modify(id, employeeDto)){
            return ResponseEntity.ok(employeeDto);
        }
        return ResponseEntity.badRequest().build();
    }


    //근태 관련
    // 직원 근태 기록 조회
    @GetMapping("/attendance/{employeeId}")
    public ResponseEntity<?> getAttendanceByEmployee(@PathVariable Long employeeId) {
        log.info("근태 기록 조회 요청: Employee ID={}", employeeId);
        List<Attendance> attendances = attendanceService.getAttendanceByEmployee(employeeId);
        return ResponseEntity.ok(attendances);
    }

    @PostMapping("/attendance/login")
    public ResponseEntity<String> markAttendanceLogin(@AuthenticationPrincipal Employee employee) {

        if (employee == null) {
            return ResponseEntity.badRequest().body("Employee not found.");
        }

        attendanceService.markLogin(employee.getId());
        log.info("Attendance marked for login: {}", employee.getEmail());
        return ResponseEntity.ok("Attendance login successful.");
    }

    @PostMapping("/attendance/logout")
    public ResponseEntity<String> markAttendanceLogout(@AuthenticationPrincipal Employee employee) {

        if (employee == null) {
            return ResponseEntity.badRequest().body("Employee not found.");
        }

        // 오늘 출석 기록 가져오기
        Attendance todayAttendance = attendanceService.findTodayAttendance(employee.getId());
        if (todayAttendance == null) {
            return ResponseEntity.badRequest().body("No login record found for today.");
        }

        // 로그아웃 기록 업데이트
        attendanceService.markLogout(todayAttendance.getId());
        log.info("Attendance marked for logout: {}", employee.getEmail());
        return ResponseEntity.ok("Attendance logout successful.");
    }

    @PostMapping("/leave/request")
    public ResponseEntity<String> requestLeave(
            @RequestParam Long employeeId,
            @RequestParam String reason,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        leaveService.requestLeave(employeeId, reason, startDate, endDate);
        log.info("Leave requested for Employee ID: {} | Reason: {} | Start: {} | End: {}",
                employeeId, reason, startDate, endDate);
        return ResponseEntity.ok("Leave requested successfully.");
    }
    // 특정 직원의 휴가 조회
    @GetMapping("/leave/{employeeId}")
    public ResponseEntity<?> getEmployeeLeaves(@PathVariable Long employeeId) {
        log.info("휴가 조회 요청: Employee ID={}", employeeId);
        List<Leave> leaves = leaveService.getLeavesByEmployee(employeeId);
        return ResponseEntity.ok(leaves);
    }

    // 휴가 취소
    @DeleteMapping("/leave/cancel/{leaveId}")
    public ResponseEntity<?> cancelLeave(@PathVariable Long leaveId) {
        log.info("휴가 취소 요청: Leave ID={}", leaveId);
        leaveService.cancelLeave(leaveId);
        return ResponseEntity.ok("Leave canceled successfully.");
    }

    // 직원 부서별 리스트 조회
    @GetMapping("/list/department/{department}")
    public ResponseEntity<?> getEmployeesByDepartment(@PathVariable String department) {
        log.info("부서별 직원 조회 요청: Department ={}", department);
        List<EmployeeDto> employees = employeeService.findByDepartment(department);
        return ResponseEntity.ok(employees);
    }

    // 직원 연차(Annual Leave) 조회
    @GetMapping("/leave/annual/{employeeId}")
    public ResponseEntity<?> getAnnualLeave(@PathVariable Long employeeId) {
        log.info("직원의 남은 연차 조회 요청: Employee ID={}", employeeId);
        EmployeeDto employeeDto = employeeService.findById(employeeId);
        if (employeeDto == null) {
            return ResponseEntity.badRequest().body("Employee not found.");
        }
        return ResponseEntity.ok("Remaining annual leave: " + employeeDto.getAnnualLeave());
    }
    @GetMapping("/attendance-leave/{employeeId}/{year}/{month}")
    public ResponseEntity<?> getMonthlyAttendanceAndLeave(
            @PathVariable Long employeeId,
            @PathVariable int year,
            @PathVariable int month) {

        log.info("근태 및 휴가 기록 조회 요청: Employee ID={}, Year={}, Month={}", employeeId, year, month);

        // 근태 기록 조회
        List<Attendance> attendanceList = attendanceService.findMonthlyAttendance(employeeId, year, month);

        // 휴가 기록 조회
        List<Leave> leaveList = leaveService.findMonthlyLeave(employeeId, year, month);

        // 결과 반환
        return ResponseEntity.ok(Map.of(
                "attendance", attendanceList,
                "leaves", leaveList
        ));
    }

}
