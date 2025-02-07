package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponseDto {
    private String message;
    private String accessToken;
    private String refreshToken;
    private String email;
    private String name;
    private Integer userGrade;

}