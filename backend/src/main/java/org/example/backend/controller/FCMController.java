package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.FCMTokenRequest;
import org.example.backend.entity.Users;
import org.example.backend.service.FirebaseService;
import org.example.backend.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/fcm")
public class FCMController {

    private final FirebaseService firebaseService;
    private final UsersService usersService;

    // 토큰 저장 여부 확인
    @GetMapping("/isStore")
    public ResponseEntity<Boolean> isStore(@AuthenticationPrincipal Users users) {
        return ResponseEntity.ok(this.firebaseService.checkToken(users));
    }


    // 토큰 저장 API
    @PutMapping("/storeToken")
    public ResponseEntity<String> storeToken(@RequestBody FCMTokenRequest tokenRequest, @AuthenticationPrincipal
    Users users) {
        String token = tokenRequest.getToken();
        this.firebaseService.saveToken(users, token);
        return ResponseEntity.ok("Token stored successfully");
    }
}