package org.example.erp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.UsersDto;
import org.example.erp.entity.Users;
import org.example.erp.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    private final UsersService usersService;
    
    // 유저 리스트 보기 매핑
    @GetMapping("/list")
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(usersService.findAll());
    }

    // 유저 상세보기 매핑
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable ("id")Long id) {
        return ResponseEntity.ok(usersService.findById(id));
    }


    // 유저 관리 매핑
    @PutMapping("/modify")
    public ResponseEntity<?> modifyUser(@Valid UsersDto userDto) {
        if (usersService.modify(userDto)) {
            return ResponseEntity.ok(usersService.findById(userDto.getId()));
        }
        return ResponseEntity.badRequest().build();
    }

    // 유저 삭제 매핑
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable ("id") Long id) {
        if (usersService.delete(id)) {
            return ResponseEntity.ok("유저 삭제 성공");
        }
        return ResponseEntity.badRequest().build();
    }
}
