package org.example.erp.repository;

import org.example.erp.entity.DiscountPolicy;
import org.example.erp.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
