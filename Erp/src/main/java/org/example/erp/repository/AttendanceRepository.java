package org.example.erp.repository;

import org.example.erp.entity.Answers;
import org.example.erp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeId(Long employee_Id);


    List<Attendance> findByEmployeeIdAndLoginTimeBetween(Long employeeId, LocalDateTime startOfMonth, LocalDateTime endOfMonth);

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.loginTime BETWEEN :startOfDay AND :endOfDay")
    Optional<Attendance> findTodayAttendance(Long employeeId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}

