package org.example.erp.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.erp.entity.Fiance;

import java.time.LocalDateTime;

/**
 *  회사 재산 관리 DTO
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FianceDto {

    private Long id;
    private String name;
    private String description;
    private Long buyPrice;
    private Long sellPrice;
    private Long currentPrice;
    private String status;//good normal bad
    private LocalDateTime buyTime;
    private LocalDateTime sellTime;

    public static Fiance toEntity(FianceDto fianceDto) {
        if (fianceDto == null) {
            return null;
        }

        Fiance fiance = new Fiance();
        fiance.setId(fianceDto.getId());
        fiance.setName(fianceDto.getName());
        fiance.setDescription(fianceDto.getDescription());
        fiance.setBuyPrice(fianceDto.getBuyPrice());
        fiance.setSellPrice(fianceDto.getSellPrice());
        fiance.setCurrentPrice(fianceDto.getCurrentPrice());
        fiance.setStatus(fianceDto.getStatus());
        fiance.setBuyTime(fianceDto.getBuyTime());
        fiance.setSellTime(fianceDto.getSellTime());

        return fiance;
    }
    public static FianceDto toDto(Fiance fiance) {
        if (fiance == null) {
            return null;
        }

        FianceDto fianceDto = new FianceDto();
        fianceDto.setId(fiance.getId());
        fianceDto.setName(fiance.getName());
        fianceDto.setDescription(fiance.getDescription());
        fianceDto.setBuyPrice(fiance.getBuyPrice());
        fianceDto.setSellPrice(fiance.getSellPrice());
        fianceDto.setCurrentPrice(fiance.getCurrentPrice());
        fianceDto.setStatus(fiance.getStatus());
        fianceDto.setBuyTime(fiance.getBuyTime());
        fianceDto.setSellTime(fiance.getSellTime());

        return fianceDto;
    }
}
