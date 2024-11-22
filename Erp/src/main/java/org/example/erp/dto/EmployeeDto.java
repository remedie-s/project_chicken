package org.example.erp.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.erp.entity.Attendance;

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
    


}
