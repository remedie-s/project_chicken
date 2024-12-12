package org.example.backend.service;

import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.Users;
import org.example.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseService {
    private final UsersRepository usersRepository;

    // 푸시 알림 보내기
    public String sendPushNotification(String fcmToken, String title, String body) throws FirebaseMessagingException {
        Message message = Message.builder()
                .setToken(fcmToken)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .build();

        return FirebaseMessaging.getInstance().send(message);  // FCM 응답
    }




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