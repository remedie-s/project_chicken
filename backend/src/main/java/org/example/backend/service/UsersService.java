package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
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
        users.setPhoneNumber(usersDto.getPhoneNumber());
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
            users.setPhoneNumber(usersDto.getPhoneNumber());
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

    public void saveRefreshToken(String email, String refreshToken) {
        Users users = findByEmail(email);
        if (users != null) {
            users.setRefreshToken(refreshToken);
            this.usersRepository.save(users);
        }
    }

    // 회원 로그인

    // 회원 로그아웃

    // 회원 탈퇴?

    // 회원 아이디 찾기

    // 회원 비밀번호 찾기






}
