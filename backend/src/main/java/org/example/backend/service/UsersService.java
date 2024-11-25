package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.UsersDto;
import org.example.backend.entity.Users;
import org.example.backend.repository.UsersRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    public Users findByName(String name) {
        Optional<Users> byName = this.usersRepository.findByName(name);
        if (byName.isPresent()) {
            return byName.get();
        }
        return null;
    }
    public Users findByEmail(String email) {
        Optional<Users> byEmail = this.usersRepository.findByEmail(email);
        if (byEmail.isPresent()) {
            return byEmail.get();
        }
        return null;
    }

    // 회원가입
    public void register(UsersDto usersDto) {

        Users users = new Users();
        users.setName(usersDto.getName());
        users.setEmail(usersDto.getEmail());
        users.setAddress(usersDto.getAddress());
        String encodedPassword = passwordEncoder.encode(usersDto.getPassword());
        users.setPassword(encodedPassword);
        users.setCreatedAt(LocalDateTime.now());
        users.setGender(usersDto.getGender());
        users.setBirthDate(usersDto.getBirthDate());
        users.setUserGrade(0);
        users.setTotalPurchaseCount(0L);
        // 구매 가격
        users.setTotalPurchasePrice(0L);
        // 비밀번호 찾기 질문
        users.setPasswordQuestion(usersDto.getPasswordQuestion());
        // 비밀번호 찾기 답변
        users.setPasswordAnswer(usersDto.getPasswordAnswer());
        this.usersRepository.save(users);
        log.info("User registered successfully");
    }
    // 회원 정보 변경
    public void modify(UsersDto usersDto) {

        Optional<Users> byId = this.usersRepository.findById(usersDto.getId());
        if (byId.isPresent()) {
            Users users = byId.get();
            users.setName(usersDto.getName());
            users.setEmail(usersDto.getEmail());
            users.setAddress(usersDto.getAddress());
            String encodedPassword = passwordEncoder.encode(usersDto.getPassword());
            users.setPassword(encodedPassword);
            users.setCreatedAt(LocalDateTime.now());
            users.setGender(usersDto.getGender());
            users.setBirthDate(usersDto.getBirthDate());
            users.setUserGrade(0);
            users.setTotalPurchaseCount(0L);
            // 구매 가격
            users.setTotalPurchasePrice(0L);
            // 비밀번호 찾기 질문
            users.setPasswordQuestion(usersDto.getPasswordQuestion());
            // 비밀번호 찾기 답변
            users.setPasswordAnswer(usersDto.getPasswordAnswer());
            this.usersRepository.save(users);
            log.info("Users Successfully Modified");
        }
        else {
            log.info("Users not found");
        }
    }

    // 회원 로그인

    // 회원 로그아웃

    // 회원 탈퇴?

    // 회원 아이디 찾기

    // 회원 비밀번호 찾기






}
