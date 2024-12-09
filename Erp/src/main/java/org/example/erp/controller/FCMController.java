package org.example.erp.controller;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.FCMTokenRequest;
import org.example.erp.dto.NotificationRequest;
import org.example.erp.service.FirebaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/fcm")
public class FCMController {

    private final FirebaseService firebaseService;



    // 토큰 저장 API
    @PutMapping("/storeToken")
    public ResponseEntity<String> storeToken(@RequestBody FCMTokenRequest tokenRequest) {
        String token = tokenRequest.getToken();
        //TODO FCM 토큰을 DB에 저장하는 로직 추가
        return ResponseEntity.ok("Token stored successfully");
    }

    // 푸시 알림 전송 API
    @PostMapping("/sendNotification")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest notificationRequest) {
        try {
            String response = firebaseService.sendPushNotification(notificationRequest.getToken(),
                    notificationRequest.getTitle(),
                    notificationRequest.getBody());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send notification");
        }
    }
}