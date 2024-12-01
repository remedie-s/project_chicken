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
import java.util.Optional;

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



    public List<Attendance> getAttendanceByEmployee(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    public List<Attendance> findMonthlyAttendance(Long employeeId, int year, int month) {
        LocalDateTime startOfMonth = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth())
                .with(LocalTime.MAX);

        return attendanceRepository.findByEmployeeIdAndLoginTimeBetween(employeeId, startOfMonth, endOfMonth);
    }

    public Attendance findTodayAttendance(Long employeeId) {
        // 오늘 날짜의 시작과 끝 계산
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        // 데이터 조회
        Optional<Attendance> todayAttendance = attendanceRepository.findTodayAttendance(employeeId, startOfDay, endOfDay);
        return todayAttendance.orElse(null);
    }

    public Attendance markLogout(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance record not found."));
        attendance.setLogoutTime(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }
}
