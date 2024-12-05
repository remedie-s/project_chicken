package org.example.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.example.backend.dto.UsersDto;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Users;
import org.example.backend.repository.OrdersRepository;
import org.example.backend.repository.UsersRepository;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringHttpMessageConverter stringHttpMessageConverter;
    private final OrdersRepository ordersRepository;

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
        } else {
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

    // users dto로 전환
    private UsersDto usersToDto(Users users) {
        UsersDto usersDto = new UsersDto();
        usersDto.setId(users.getId());
        usersDto.setName(users.getName());
        usersDto.setEmail(users.getEmail());
        usersDto.setCreatedAt(users.getCreatedAt());
        usersDto.setAddress(users.getAddress());
        usersDto.setGender(users.getGender());
        usersDto.setBirthDate(users.getBirthDate());
        usersDto.setPhoneNumber(users.getPhoneNumber());
        usersDto.setTotalPurchaseCount(users.getTotalPurchaseCount());
        usersDto.setTotalPurchasePrice(users.getTotalPurchasePrice());
        usersDto.setPasswordQuestion(users.getPasswordQuestion());
        usersDto.setPasswordAnswer(users.getPasswordAnswer());
        usersDto.setUserGrade(users.getUserGrade());
        return usersDto;
    }

    // 회원 정보 조회
    public UsersDto getUserDetailDto(Users users) {
        String email = users.getEmail();
        Users user = this.findByEmail(email);
        return this.usersToDto(user);
    };
    // 비밀번호 질답 획득
    public UsersDto getPasswordQa(String email) {
        Users users = this.findByEmail(email);
        UsersDto usersDto = new UsersDto();
        usersDto.setPasswordQuestion(users.getPasswordQuestion());
        usersDto.setPasswordAnswer(users.getPasswordAnswer());
        return usersDto;
    };

    // 회원 탈퇴?
    public boolean userDelete(Users users) {
        Users user = this.findByEmail(users.getEmail());
        if (user == null) {
            return false;
        }
        this.usersRepository.delete(user);
        return true;
    };
    // 회원 아이디 찾기

    // 비밀번호 변경
    public boolean passwordChange(UsersDto usersDto) {
        String email = usersDto.getEmail();
        String newPassword = usersDto.getPassword();
        Users users = this.findByEmail(email);
        if (users == null) {
            return false;
        }
        users.setPassword(passwordEncoder.encode(newPassword));
        this.usersRepository.save(users);
        return true;
    }

    // 매달 1일 회원 등급 변경
    // 매달 1일 00:00시에 등급 변경 메소드 실행
    @Scheduled(cron = "0 0 0 1 * *")
    public void updateUserGradesScheduled() {
        updateUserGrades();
    }
    // 실제 등급 변경 메소드
    @Transactional
    public void updateUserGrades() {
        // 1. 지난달 시작일과 종료일을 구하기 (LocalDateTime)
        LocalDateTime startDate = LocalDateTime.now().minusMonths(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endDate = startDate.plusMonths(1).minusDays(1).withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        // 2. 모든 사용자에 대해 지난달 결제 금액을 계산
        List<Users> users = usersRepository.findAll(); // 모든 사용자 조회

        for (Users user : users) {
            // 3. 사용자의 주문 내역 조회
            List<Orders> orders = this.ordersRepository.findByUsersIdAndCreatedAtBetween(user.getId(), startDate, endDate);

            // 4. 총 결제 금액 계산
            Long totalPayPrice = 0L;
            for (Orders order : orders) {
                totalPayPrice += order.getPayPrice();
            }
            // 5. 사용자 등급 계산
            Integer newGrade = determineUserGrade(totalPayPrice);

            // 6. 사용자 등급 업데이트
            user.setUserGrade(newGrade);
            usersRepository.save(user); // 등급 업데이트
        }
    }
    // 금액 별 등급 분류
    private Integer determineUserGrade(Long totalPayPrice) {
        if (totalPayPrice >= 300000) {
            return 3;
        } else if (totalPayPrice >= 200000) {
            return 2;
        } else if (totalPayPrice >= 100000) {
            return 1;
        } else {
            return 0;
        }
    }

}
