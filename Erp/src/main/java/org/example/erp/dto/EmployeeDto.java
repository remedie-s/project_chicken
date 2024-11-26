package org.example.erp.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.erp.entity.Attendance;
import org.example.erp.entity.Employee;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 직원 관리시 사용하는 DTO
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

    private LocalDateTime hireDate;

    private LocalDateTime resignationDate;

    private double annualLeave;

    private Integer rating;

    public static EmployeeDto toDto(Employee employee) {
        if (employee == null) {
            return null;
        }

        return new EmployeeDto(
                employee.getId(),
                employee.getPassword(),
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
                employee.getRating()
        );

    }
    // DTO to Entity
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

        return employee;
    }

}
