package org.example.erp.dto;

import lombok.Data;

@Data // lombok 사용
public class TokenRequestDto {
    private String refreshToken;
}