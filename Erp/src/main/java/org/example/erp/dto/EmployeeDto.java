package org.example.erp.dto;

import lombok.*;
import org.example.erp.entity.Employee;
import org.example.erp.entity.Role;

import java.time.LocalDate;
import java.util.List;

/**
 * 직원 관리 시 사용하는 DTO
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {

    private Long id;
    private String password;
    private String name;
    private String email;
    private String gender;
    private String address;
    private LocalDate birthDate;
    private String phoneNumber;
    private String department;
    private String position;
    private Long salary;
    private Long incentive;
    private LocalDate hireDate;
    private LocalDate resignationDate;
    private double annualLeave;
    private Integer rating;

    private List<Role> roles; // 역할 정보 추가

    /**
     * Entity -> DTO 변환
     */
    public static EmployeeDto toDto(Employee employee) {
        if (employee == null) {
            return null;
        }

        return new EmployeeDto(
                employee.getId(),
                null, // Password는 DTO 변환 시 제외 (보안상 이유)
                employee.getName(),
                employee.getEmail(),
                employee.getGender(),
                employee.getAddress(),
                employee.getBirthDate(),
                employee.getPhoneNumber(),
                employee.getDepartment(),
                employee.getPosition(),
                employee.getSalary(),
                employee.getIncentive(),
                employee.getHireDate(),
                employee.getResignationDate(),
                employee.getAnnualLeave(),
                employee.getRating(),
                employee.getRoles() // Role 정보를 추가
        );
    }

    /**
     * DTO -> Entity 변환
     */
    public static Employee toEntity(EmployeeDto employeeDto) {
        if (employeeDto == null) {
            return null;
        }

        Employee employee = new Employee();
        employee.setId(employeeDto.getId());
        employee.setPassword(employeeDto.getPassword());
        employee.setName(employeeDto.getName());
        employee.setEmail(employeeDto.getEmail());
        employee.setGender(employeeDto.getGender());
        employee.setAddress(employeeDto.getAddress());
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
        employee.setRoles(employeeDto.getRoles()); // Role 정보를 추가

        return employee;
    }
}
