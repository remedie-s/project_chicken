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
            return ResponseEntity.badRequest().body(new TokenResponseDto("User not found.", null));
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(employeeDto.getPassword(), login.getPassword())) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid email or password.", null));
        }

        // 토큰 생성
        String token = jwtUtil.generateToken(login.getEmail());

        // 성공적으로 로그인한 사용자 정보와 토큰 반환
        return ResponseEntity.ok(new TokenResponseDto("Login successful", token));
    }

}
