package org.example.erp.repository;

import org.example.erp.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByEmployee_Id(Long employeeId);

    List<Leave> findByEmployeeIdAndStartDateBetween(Long employeeId, LocalDate startOfMonth, LocalDate endOfMonth);
}
