package org.example.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class KafkaProductMessage {
    private String action;
    private Long id;
    private String name;
    private Long stock;
    private Long userId;
    private String address;

    public KafkaProductMessage() {
    }

}
