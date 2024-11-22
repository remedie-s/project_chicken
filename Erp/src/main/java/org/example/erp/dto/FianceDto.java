package org.example.erp.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *  회사 재산 관리 DTO
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FianceDto {

    private Long id;
    private Long revenue;
    private Long expense;
    private Long profit;

    private String quarter;
    private Integer year;
}
