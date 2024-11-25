package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.TokenResponseDto;
import org.example.backend.dto.UsersDto;
import org.example.backend.entity.Users;
import org.example.backend.service.UsersService;
import org.example.backend.utility.JwtUtil;
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
    private final UsersService usersService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

   @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UsersDto usersDto) {
       
       if (usersService.findByEmail(usersDto.getEmail())!= null) {
           return ResponseEntity.badRequest().body("User with the same email already exists.");
       }
       this.usersService.register(usersDto);
       return ResponseEntity.ok().body("User registered successfully.");
   }



    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody UsersDto usersDto) {
        // 이메일로 사용자 조회
        Users login = usersService.findByEmail(usersDto.getEmail());
        if (login == null) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("User not found.", null, null, null));
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(usersDto.getPassword(), login.getPassword())) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid email or password.", null, null, null));
        }

        // 토큰 생성
        String token = jwtUtil.generateToken(login.getEmail());

        // 성공적으로 로그인한 사용자 정보와 토큰 반환
        return ResponseEntity.ok(new TokenResponseDto("Login successful", token, login.getEmail(), login.getName()));
    }

}
