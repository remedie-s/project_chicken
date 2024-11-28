package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.Attendance;
import org.example.erp.entity.Employee;
import org.example.erp.repository.AttendanceRepository;
import org.example.erp.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public Attendance markLogin(Long employeeId) {
        Attendance attendance = new Attendance();
        attendance.setEmployee(this.employeeRepository.findById(employeeId).get());
        attendance.setLoginTime(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    public Attendance markLogout(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId).orElseThrow();
        attendance.setLogoutTime(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByEmployee(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }
    public Attendance findTodayAttendance(Long employeeId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        return attendanceRepository.findByEmployeeIdAndLoginTimeBetween(employeeId, startOfDay, endOfDay)
                .orElse(null);
    }

}
