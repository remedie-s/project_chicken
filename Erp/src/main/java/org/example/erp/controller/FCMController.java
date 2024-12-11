package org.example.erp.controller;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.EmployeeDto;
import org.example.erp.dto.FCMTokenRequest;
import org.example.erp.dto.NotificationRequest;
import org.example.erp.entity.Employee;
import org.example.erp.entity.Role;
import org.example.erp.service.EmployeeService;
import org.example.erp.service.FirebaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/fcm")
public class FCMController {

    private final FirebaseService firebaseService;
    private final EmployeeService employeeService;

    // 토큰 저장 여부 확인
    @GetMapping("/isStore")
    public ResponseEntity<Boolean> isStore(@AuthenticationPrincipal Employee employee) {
        return ResponseEntity.ok(this.firebaseService.checkToken(employee));
    }



    // 토큰 저장 API
    @PutMapping("/storeToken")
    public ResponseEntity<String> storeToken(@RequestBody FCMTokenRequest tokenRequest, @AuthenticationPrincipal
                                             Employee employee) {
        String token = tokenRequest.getToken();
        this.firebaseService.saveToken(employee, token);
        return ResponseEntity.ok("Token stored successfully");
    }

    // 푸시 알림 전송 API
    @PostMapping("/sendNotification")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest notificationRequest) {
        try {
            EmployeeDto byId = this.employeeService.findById(notificationRequest.getUserId());
            String response = firebaseService.sendPushNotification(byId.getFcmToken(),
                    notificationRequest.getTitle(),
                    notificationRequest.getBody());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send notification");
        }
    }
    // 푸시 알림 전송 API
    @PostMapping("/sendNotification/role")
    public ResponseEntity<String> sendNotificationRole(@RequestBody NotificationRequest notificationRequest) {
        try {
            String s = this.firebaseService.sendPushNotificationToRole(Role.MANAGER, notificationRequest.getTitle(), notificationRequest.getBody());
            return ResponseEntity.ok(s);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send notification");
        }
    }
}