package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.EmployeeDto;
import org.example.erp.entity.Employee;
import org.example.erp.repository.AttendanceRepository;
import org.example.erp.repository.EmployeeRepository;
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

    public Employee findByName(String name) {
        Optional<Employee> byName = this.employeeRepository.findByName(name);
        if (byName.isPresent()) {
            return byName.get();
        }
        return null;
    }

    public Employee findByEmail(String email) {
        Optional<Employee> byEmail = this.employeeRepository.findByEmail(email);
        if (byEmail.isPresent()) {
            return byEmail.get();
        }
        return null;
    }

    // 직원 가입
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
        employee.setAnnualLeave(employeeDto.getAnnualLeave());
        employee.setRating(employeeDto.getRating());

        this.employeeRepository.save(employee);
        log.info("Employee registered successfully");

    }
    // 직원 변경
    public boolean modify(Long id, EmployeeDto employeeDto) {

        Optional<Employee> byId = this.employeeRepository.findById(id);
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
            this.employeeRepository.save(employee);
            log.info("Employee Successfully Modified");
            return true;
        }
        else {
            log.info("Employee not found");
            return false;
        }
    }
    // 직원 삭제
    public void delete(EmployeeDto employeeDto) {
        Optional<Employee> byId = this.employeeRepository.findById(employeeDto.getId());
        if (byId.isPresent()) {
            Employee employee = byId.get();
            this.employeeRepository.delete(employee);
        }
    }

    // 직원 리스트조회(임원, 인사과)
    public List<EmployeeDto> findAll() {
        List<Employee> all = this.employeeRepository.findAll();
        List<EmployeeDto> employeeDtos = new ArrayList<>();
            for (Employee employee : all) {
                EmployeeDto.toDto(employee);
                employeeDtos.add(EmployeeDto.toDto(employee));
        }
            return employeeDtos;
    }

    // 직원 부서별 리스트 조회(임원, 인사과)
    public List<EmployeeDto> findByDepartment(String department) {
        List<Employee> byDepartment = this.employeeRepository.findByDepartment(department);
        List<EmployeeDto> employeeDtos = new ArrayList<>();
        for (Employee employee : byDepartment) {
            EmployeeDto.toDto(employee);
            employeeDtos.add(EmployeeDto.toDto(employee));
        }
        return employeeDtos;
    }

    // 직원 상세페이지(임원, 인사과, 본인)
    public EmployeeDto findById(Long id) {
        Optional<Employee> byId = this.employeeRepository.findById(id);
        if (byId.isPresent()) {
            Employee employee = byId.get();
            return EmployeeDto.toDto(employee);
        }
        return null;
    }

    // 직원 리스트조회(id,name, email, phoneNumber, department, hireDate)
    public List<EmployeeDto> findAllToEmployee() {
        List<Employee> all = this.employeeRepository.findAll();
        List<EmployeeDto> employeeDtos = new ArrayList<>();
        for (Employee employee : all) {
            for (EmployeeDto employeeDto : employeeDtos) {
                employeeDto.setId(employee.getId());
                employeeDto.setName(employee.getName());
                employeeDto.setEmail(employee.getEmail());
                employeeDto.setPhoneNumber(employee.getPhoneNumber());
                employeeDto.setDepartment(employee.getDepartment());
                employeeDto.setHireDate(employee.getHireDate());
                employeeDto.setResignationDate(employee.getResignationDate());
                
            }
        }
        return employeeDtos;
    }

    // 직원 상세페이지(name, email, phoneNumber, department, hireDate)
    public EmployeeDto findByIdToEmployee(Long id) {
        Optional<Employee> byId = this.employeeRepository.findById(id);
        if (byId.isPresent()) {
            EmployeeDto employeeDto = new EmployeeDto();
            Employee employee = byId.get();
            employeeDto.setId(employee.getId());
            employeeDto.setName(employee.getName());
            employeeDto.setEmail(employee.getEmail());
            employeeDto.setPhoneNumber(employee.getPhoneNumber());
            employeeDto.setDepartment(employee.getDepartment());
            employeeDto.setHireDate(employee.getHireDate());
            employeeDto.setResignationDate(employee.getResignationDate());
            return employeeDto;
        }
        return null;
    }

    public void saveRefreshToken(String email, String refreshToken) {
        Employee employee=findByEmail(email);
        if(employee!=null){
            employee.setRefreshToken(refreshToken);
            employeeRepository.save(employee);
        }

    }


    // 추가로직


}
