package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.Employee;
import org.example.erp.entity.Leave;
import org.example.erp.repository.EmployeeRepository;
import org.example.erp.repository.LeaveRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class LeaveService {
    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;


    public Leave requestLeave(Long employeeId, String reason, LocalDate startDate, LocalDate endDate) {
        Leave leave = new Leave();
        Employee employee = this.employeeRepository.findById(employeeId).orElseThrow(
                () -> new IllegalArgumentException("Employee not found with ID: " + employeeId)
        );

        leave.setReason(reason);
        leave.setStartDate(startDate);
        leave.setEndDate(endDate);
        leave.setEmployee(employee);

        // startDate와 endDate 사이의 날짜 계산
        long leaveDays = ChronoUnit.DAYS.between(startDate, endDate) + 1; // 양쪽 포함
        if (leaveDays <= 0) {
            throw new IllegalArgumentException("Invalid leave dates. Start date must be before or equal to end date.");
        }

        // 직원의 남은 연가에서 차감
        if (employee.getAnnualLeave() < leaveDays) {
            throw new IllegalArgumentException("Insufficient annual leave balance.");
        }
        employee.setAnnualLeave(employee.getAnnualLeave() - leaveDays);
        this.employeeRepository.save(employee);
        return leaveRepository.save(leave);
    }


    public List<Leave> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findByEmployee_Id(employeeId);
    }

    public void cancelLeave(Long leaveId) {
        leaveRepository.deleteById(leaveId);
    }

}
