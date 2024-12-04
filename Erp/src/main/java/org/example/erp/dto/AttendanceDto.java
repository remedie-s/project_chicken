package org.example.erp.dto;

import jakarta.persistence.ManyToOne;
import lombok.*;
import org.example.erp.entity.Employee;

import java.time.LocalDateTime;

/**
 * 근태 관리시 사용하는 DTO
 */
@Getter
@Setter
@ToString
@NoArgsConstructor

@AllArgsConstructor
public class AttendanceDto {

    private Long id;

    private LocalDateTime loginTime;
    private LocalDateTime logoutTime;
    private boolean leaveCompany;
    private String status;
    private Employee employee;
}
