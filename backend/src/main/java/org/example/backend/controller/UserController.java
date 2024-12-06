package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.TokenResponseDto;
import org.example.backend.dto.UsersDto;
import org.example.backend.entity.Users;
import org.example.backend.service.UsersService;
import org.example.backend.utility.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UsersService usersService;
    private final JwtUtil jwtUtil;

    // 유저 정보 조회
    @GetMapping("/detail")
    public ResponseEntity<?> userDetail(@AuthenticationPrincipal Users users) {
        if (users == null) {
            return ResponseEntity.status(500).body("유저 정보를 찾지 못 했습니다.");
        }
        UsersDto usersDto = this.usersService.getUserDetailDto(users);
        return ResponseEntity.ok(usersDto);
    }
    // 비밀번호 질답 획득
    @PostMapping("/passwordqa")
    public ResponseEntity<?> passwordqa(String email) {
        UsersDto usersDto = this.usersService.getPasswordQa(email);
        if (usersDto == null) {
            return ResponseEntity.status(500).body("유저 정보를 찾지 못 했습니다.");}
        return ResponseEntity.ok(usersDto);
    }
    // 유저 탈퇴
    @PostMapping("/delete")
    public ResponseEntity delete(@AuthenticationPrincipal Users users) {
        if (this.usersService.userDelete(users)) {return ResponseEntity.ok("회원 탈퇴 성공");}
        return ResponseEntity.status(500).body("회원 탈퇴 실패");
    }
}
