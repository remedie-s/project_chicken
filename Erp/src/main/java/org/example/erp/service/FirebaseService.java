package org.example.erp.service;

import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.Employee;
import org.example.erp.entity.Role;
import org.example.erp.repository.EmployeeRepository;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseService {
    private final EmployeeRepository employeeRepository;

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

    // 롤기반 푸시 알림 보내기
    public String sendPushNotificationToRole(Role role, String title, String body) {
        // 특정 역할을 가진 사용자 목록 조회
        List<Employee> employees = employeeRepository.findByRolesContaining(role);

        // 메시지 전송을 위한 FCM 토큰 목록
        List<String> tokens = new ArrayList<>();
        for (Employee employee : employees) {
            if (employee.getFcmToken() != null) {
                tokens.add(employee.getFcmToken());
            }
        }

        // 각 사용자에게 푸시 알림 전송
        for (String token : tokens) {
            try {
                Message message = Message.builder()
                        .setToken(token)
                        .setNotification(Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .build())
                        .build();

                // FCM에 메시지 전송
                String response = FirebaseMessaging.getInstance().send(message);
                log.info("Successfully sent message to token: " + token);
            } catch (FirebaseMessagingException e) {
                log.error("Error sending message to token: " + token, e);
            }
        }

        return "Messages sent individually.";
    }



    // 토큰 저장
    public String saveToken(Employee employee, String fcmToken) {
        if (fcmToken.equals(employee.getFcmToken())) {
            log.info("FCM Token is already up-to-date.");
            return fcmToken;
        }
        employee.setFcmToken(fcmToken);
        employeeRepository.save(employee);
        return fcmToken;
    }
    // 저장 여부 확인
    public Boolean checkToken(Employee employee) {

        if (employee.getFcmToken() != null) {


            return true;
        }

        return false;
    }
}

