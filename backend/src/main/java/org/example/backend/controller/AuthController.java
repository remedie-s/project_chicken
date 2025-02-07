package org.example.backend.controller;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.RefreshRequest;
import org.example.backend.dto.TokenResponseDto;
import org.example.backend.dto.UsersDto;
import org.example.backend.entity.Users;
import org.example.backend.service.UsersService;
import org.example.backend.utility.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
            return ResponseEntity.badRequest().body(new TokenResponseDto("User not found.", null, null, null, null,null));
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(usersDto.getPassword(), login.getPassword())) {
            return ResponseEntity.badRequest().body(new TokenResponseDto("Invalid email or password.", null, null, null, null, null));
        }

        // 토큰 생성
        String accessToken  = jwtUtil.generateToken(login.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(login.getEmail());

        // 리프레시 토큰 저장
        usersService.saveRefreshToken(login.getEmail(), refreshToken);
        // 로그인 후 SecurityContextHolder에 인증 정보 저장
        jwtUtil.authenticateUser(login);

        // 성공적으로 로그인한 사용자 정보와 토큰 반환
        return ResponseEntity.ok(new TokenResponseDto("Login successful", accessToken, refreshToken  ,login.getEmail(),login.getName(), login.getUserGrade()));
    }
    // 리프레시 토큰 확인 후 재발급
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refresh(@RequestBody RefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        try {
            jwtUtil.validateToken(refreshToken);

            String username = jwtUtil.extractUsername(refreshToken);
            var user = usersService.findByEmail(username);

            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(new TokenResponseDto("User not found.", null, null, null, null, null));
            }

            String newAccessToken = jwtUtil.generateToken(username);
            Integer userGrade = user.getUserGrade();

            return ResponseEntity.ok(new TokenResponseDto("Token refreshed successfully",
                    newAccessToken,
                    refreshToken,
                    user.getEmail(),
                    username,
                    userGrade));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(401)
                    .body(new TokenResponseDto("Refresh token expired.", null, null, null, null, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new TokenResponseDto("Invalid refresh token.", null, null, null, null, null));
        }
    }

    // 비밀번호 변경
    @PostMapping("/passwordchange")
    public ResponseEntity passwordChange(@RequestBody UsersDto usersDto) {
        if (this.usersService.passwordChange(usersDto)) {return ResponseEntity.ok("비밀번호 변경 성공");}
        return ResponseEntity.status(500).body("비밀번호 변경에 실패");
    }
    // 비밀번호 질답 획득
    @GetMapping("/passwordqa")
    public ResponseEntity<?> passwordqa(String email) {
        UsersDto usersDto = this.usersService.getPasswordQa(email);
        if (usersDto == null) {
            return ResponseEntity.status(500).body("유저 정보를 찾지 못 했습니다.");}
        return ResponseEntity.ok(usersDto);
    }

}
