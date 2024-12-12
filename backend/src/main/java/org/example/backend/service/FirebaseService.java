package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.Users;
import org.example.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;


@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseService {
    private final UsersRepository usersRepository;






    // 토큰 저장
    public String saveToken(Users users, String fcmToken) {
        if (fcmToken.equals(users.getFcmToken())) {
            log.info("FCM Token is already up-to-date.");
            return fcmToken;
        }
        users.setFcmToken(fcmToken);
        usersRepository.save(users);
        return fcmToken;
    }
    // 저장 여부 확인
    public Boolean checkToken(Users users) {

        if (users.getFcmToken() != null) {


            return true;
        }

        return false;
    }
}