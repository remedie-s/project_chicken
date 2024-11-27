package org.example.backend.utility;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityContextExample {
    public void checkSecurityContext() {
        // SecurityContext에서 Authentication 객체 가져오기
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        if (authentication != null) {
            // 인증된 사용자 정보 출력
            System.out.println("Principal: " + authentication.getPrincipal()); // 사용자 정보
            System.out.println("Authorities: " + authentication.getAuthorities()); // 사용자 권한
            System.out.println("Credentials: " + authentication.getCredentials()); // 인증 자격 증명
            System.out.println("Name: " + authentication.getName()); // 사용자 이름
        } else {
            System.out.println("No Authentication information found.");
        }
    }
}
