package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.service.UsersService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    private final UsersService usersService;
    
    // 유저 리스트 보기 매핑

    // 유저 상세보기 매핑

    // 유저 관리 매핑

    // 유저 등급변경 매핑 - 강제로

    // 유저 삭제 매핑
}
