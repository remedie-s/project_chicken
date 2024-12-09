package org.example.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponseDto {
    private String message;
    private String accessToken;
    private String refreshToken;
    private List<String> roles;  // role을 List<String>으로 변경
    private String email;
    private String name;
}
