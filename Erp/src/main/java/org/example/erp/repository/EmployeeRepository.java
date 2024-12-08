package org.example.erp.repository;

import org.example.erp.entity.DiscountPolicy;
import org.example.erp.entity.Employee;
import org.example.erp.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // 이름으로 직원 조회
    Optional<Employee> findByName(String name);

    // 이메일로 직원 조회
    Optional<Employee> findByEmail(String email);

    // 부서별 직원 조회
    List<Employee> findByDepartment(String department);

    // 특정 역할을 가진 직원 조회
    List<Employee> findByRolesContaining(Role role);

    // 여러 역할을 가진 직원 조회
    List<Employee> findByRolesIn(List<Role> roles);

    // 특정 부서와 역할을 가진 직원 조회
    List<Employee> findByRolesContainingAndDepartment(Role role, String department);

    // 특정 부서와 여러 역할을 가진 직원 조회
    List<Employee> findByRolesInAndDepartment(List<Role> roles, String department);
}
