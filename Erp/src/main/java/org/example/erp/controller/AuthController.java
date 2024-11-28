package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.EmployeeDto;

import org.example.erp.dto.TokenResponseDto;
import org.example.erp.entity.Employee;
import org.example.erp.service.EmployeeService;
import org.example.erp.utility.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final EmployeeService employeeService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

   @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody EmployeeDto employeeDto) {
       
       if (employeeService.findByEmail(employeeDto.getEmail())!= null) {
           return ResponseEntity.badRequest().body("User with the same email already exists.");
       }
       this.employeeService.register(employeeDto);
       return ResponseEntity.ok().body("User registered successfully.");
   }



    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody EmployeeDto employeeDto) {
        // 이메일로 사용자 조회
        Employee login = employeeService.findByEmail(employeeDto.getEmail());
        if (login == null) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("User not found.", null, null,null,null));
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(employeeDto.getPassword(), login.getPassword())) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid email or password.",null, null,null,null));
        }

        // 토큰 생성
        String accessToken  = jwtUtil.generateToken(login.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(login.getEmail());

        // 리프레시 토큰 저장
        employeeService.saveRefreshToken(login.getEmail(), refreshToken);
        // 로그인 후 SecurityContextHolder에 인증 정보 저장
        jwtUtil.authenticateUser(login);
        // 성공적으로 로그인한 사용자 정보와 토큰 반환
        return ResponseEntity.ok(new TokenResponseDto("Login successful", accessToken, refreshToken  ,login.getEmail(),login.getName()));
    }
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refresh(@RequestBody String refreshToken) {
        // 리프레시 토큰 검증
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid refresh token.",null, null, null, null));
        }

        // 토큰에서 사용자 정보 추출
        String username = jwtUtil.extractUsername(refreshToken);
        if (username == null || employeeService.findByEmail(username) == null) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid refresh token.",null, null, null, null));
        }

        // 새로운 액세스 토큰 발급
        String newAccessToken = jwtUtil.generateToken(username);

        return ResponseEntity.ok(new TokenResponseDto("Token refreshed successfully", newAccessToken, refreshToken, username,this.employeeService.findByEmail(username).getName()));
    }

}
