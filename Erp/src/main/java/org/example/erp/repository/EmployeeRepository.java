package org.example.erp.repository;

import org.example.erp.entity.DiscountPolicy;
import org.example.erp.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByName(String name);

    Optional<Employee> findByEmail(String email);

    List<Employee> findByDepartment(String department);
}
