package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.EmployeeDto;

import org.example.erp.dto.TokenRequestDto;
import org.example.erp.dto.TokenResponseDto;
import org.example.erp.entity.Attendance;
import org.example.erp.entity.Employee;
import org.example.erp.service.AttendanceService;
import org.example.erp.service.EmployeeService;
import org.example.erp.utility.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final EmployeeService employeeService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AttendanceService attendanceService;

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
            return ResponseEntity.badRequest().body(new TokenResponseDto("User not found.", null, null, null, null, null));
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(employeeDto.getPassword(), login.getPassword())) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid email or password.", null, null, null, null, null));
        }

        // 토큰 생성
        String accessToken = jwtUtil.generateToken(login.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(login.getEmail());

        // 리프레시 토큰 저장
        employeeService.saveRefreshToken(login.getEmail(), refreshToken);
        // 로그인 후 SecurityContextHolder에 인증 정보 저장
        jwtUtil.authenticateUser(login);

        // Employee의 roles을 List<String>으로 변환하여 반환
        List<String> roles = login.getRoles().stream()
                .map(role -> role.name())  // Role enum을 String으로 변환
                .collect(Collectors.toList());

        // 성공적으로 로그인한 사용자 정보와 토큰 반환
        return ResponseEntity.ok(new TokenResponseDto("Login successful", accessToken, refreshToken, roles, login.getEmail(), login.getName()));
    }
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refresh(@RequestBody String refreshToken) {
        // 리프레시 토큰 검증
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid refresh token.", null, null, null, null, null));
        }

        // 토큰에서 사용자 정보 추출
        String username = jwtUtil.extractUsername(refreshToken);
        if (username == null || employeeService.findByEmail(username) == null) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid refresh token.", null, null, null, null, null));
        }

        // 새로운 액세스 토큰 발급
        String newAccessToken = jwtUtil.generateToken(username);

        // Employee의 roles을 List<String>으로 변환하여 반환
        Employee employee = this.employeeService.findByEmail(username);
        List<String> roles = employee.getRoles().stream()
                .map(role -> role.name())  // Role enum을 String으로 변환
                .collect(Collectors.toList());

        return ResponseEntity.ok(new TokenResponseDto("Token refreshed successfully", newAccessToken, refreshToken, roles, username, employee.getName()));
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody TokenRequestDto tokenRequestDto) {
        String refreshToken = tokenRequestDto.getRefreshToken();

        // 리프레시 토큰 검증
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            return ResponseEntity.badRequest().body("Invalid refresh token.");
        }

        // 리프레시 토큰으로 사용자 정보 추출
        String username = jwtUtil.extractUsername(refreshToken);
        if (username == null || employeeService.findByEmail(username) == null) {
            return ResponseEntity.badRequest().body("Invalid refresh token.");
        }

        // 리프레시 토큰 삭제
        employeeService.saveRefreshToken(username, null);
        log.info("User '{}' logged out successfully.", username);
        return ResponseEntity.ok("Logout successful.");
    }

}
