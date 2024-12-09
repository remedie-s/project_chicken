package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.EmployeeDto;
import org.example.erp.entity.Employee;
import org.example.erp.entity.Role;
import org.example.erp.repository.AttendanceRepository;
import org.example.erp.repository.EmployeeRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    // 직원 등록
    public void register(EmployeeDto employeeDto) {
        Employee employee = new Employee();
        employee.setName(employeeDto.getName());
        employee.setEmail(employeeDto.getEmail());
        employee.setAddress(employeeDto.getAddress());
        String encodedPassword = passwordEncoder.encode(employeeDto.getPassword());
        employee.setPassword(encodedPassword);
        employee.setCreatedAt(LocalDateTime.now());
        employee.setGender(employeeDto.getGender());
        employee.setBirthDate(employeeDto.getBirthDate());
        employee.setPhoneNumber(employeeDto.getPhoneNumber());
        employee.setDepartment(employeeDto.getDepartment());
        employee.setPosition(employeeDto.getPosition());
        employee.setSalary(employeeDto.getSalary());
        employee.setIncentive(employeeDto.getIncentive());
        employee.setHireDate(employeeDto.getHireDate());
        employee.setResignationDate(employeeDto.getResignationDate());
        employee.setAnnualLeave(15);
        employee.setRating(employeeDto.getRating());

        // 역할 설정
        if (employeeDto.getRoles() == null || employeeDto.getRoles().isEmpty()) {
            employee.setRoles(List.of(Role.USER)); // 기본 USER 역할 설정
        } else {
            employee.setRoles(employeeDto.getRoles());
        }

        employeeRepository.save(employee);
        log.info("Employee registered successfully");
    }

    // 직원 수정
    public boolean modify(Long id, EmployeeDto employeeDto) {
        Optional<Employee> byId = employeeRepository.findById(id);
        if (byId.isPresent()) {
            Employee employee = byId.get();
            employee.setName(employeeDto.getName());
            employee.setEmail(employeeDto.getEmail());
            employee.setAddress(employeeDto.getAddress());
            employee.setGender(employeeDto.getGender());
            employee.setBirthDate(employeeDto.getBirthDate());
            employee.setPhoneNumber(employeeDto.getPhoneNumber());
            employee.setDepartment(employeeDto.getDepartment());
            employee.setPosition(employeeDto.getPosition());
            employee.setSalary(employeeDto.getSalary());
            employee.setIncentive(employeeDto.getIncentive());
            employee.setHireDate(employeeDto.getHireDate());
            employee.setResignationDate(employeeDto.getResignationDate());
            employee.setAnnualLeave(employeeDto.getAnnualLeave());
            employee.setRating(employeeDto.getRating());

            // 역할 수정
            if (employeeDto.getRoles() != null && !employeeDto.getRoles().isEmpty()) {
                employee.setRoles(employeeDto.getRoles());
            }

            employeeRepository.save(employee);
            log.info("Employee Successfully Modified");
            return true;
        } else {
            log.info("Employee not found");
            return false;
        }
    }

    // 직원 삭제
    public boolean delete(Long id) {
        if (!isAdmin()) {
            log.info("Access denied: Only admins can delete employees");
            return false;
        }

        Optional<Employee> byId = employeeRepository.findById(id);
        if (byId.isPresent()) {
            Employee employee = byId.get();
            employeeRepository.delete(employee);
            return true;
        }
        return false;
    }

    // 모든 직원 조회
    public List<EmployeeDto> findAll() {
        List<Employee> all = employeeRepository.findAll();
        List<EmployeeDto> employeeDtos = new ArrayList<>();
        for (Employee employee : all) {
            EmployeeDto dto = EmployeeDto.toDto(employee);
            dto.setRoles(employee.getRoles()); // Role 데이터 포함
            employeeDtos.add(dto);
        }
        return employeeDtos;
    }

    // 특정 Role 기반 직원 조회
    public List<EmployeeDto> findByRole(Role role) {
        List<Employee> employees = employeeRepository.findByRolesContaining(role);
        List<EmployeeDto> employeeDtos = new ArrayList<>();
        for (Employee employee : employees) {
            EmployeeDto dto = EmployeeDto.toDto(employee);
            dto.setRoles(employee.getRoles());
            employeeDtos.add(dto);
        }
        return employeeDtos;
    }

    // 부서별 직원 조회
    public List<EmployeeDto> findByDepartment(String department) {
        List<Employee> byDepartment = employeeRepository.findByDepartment(department);
        List<EmployeeDto> employeeDtos = new ArrayList<>();
        for (Employee employee : byDepartment) {
            EmployeeDto dto = EmployeeDto.toDto(employee);
            dto.setRoles(employee.getRoles());
            employeeDtos.add(dto);
        }
        return employeeDtos;
    }

    // ID 기반 직원 조회 (본인, 임원, 인사과)
    public EmployeeDto findById(Long id) {
        Optional<Employee> byId = employeeRepository.findById(id);
        if (byId.isPresent()) {
            Employee employee = byId.get();
            return EmployeeDto.toDto(employee);
        }
        return null;
    }

    // 간단한 직원 리스트 조회
    public List<EmployeeDto> findAllToEmployee() {
        List<Employee> all = employeeRepository.findAll();
        List<EmployeeDto> employeeDtos = new ArrayList<>();
        for (Employee employee : all) {
            EmployeeDto dto = EmployeeDto.toDto(employee);
            dto.setRoles(null); // 간단한 조회 시 Role 제외
            employeeDtos.add(dto);
        }
        return employeeDtos;
    }

    // 현재 사용자가 Admin인지 확인
    private boolean isAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }

    public void saveRefreshToken(String email, String refreshToken) {
        Employee employee = findByEmail(email);
        if (employee != null) {
            employee.setRefreshToken(refreshToken);
            employeeRepository.save(employee);
        }
    }

    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email).orElse(null);
    }


}
