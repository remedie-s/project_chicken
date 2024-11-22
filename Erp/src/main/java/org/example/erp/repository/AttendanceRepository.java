package org.example.erp.repository;

import org.example.erp.entity.Answers;
import org.example.erp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}
