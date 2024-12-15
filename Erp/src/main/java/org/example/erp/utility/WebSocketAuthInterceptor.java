package org.example.erp.utility;

import org.example.erp.utility.JwtUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    public WebSocketAuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        // 로그 추가
        System.out.println("WebSocket connection attempt: " + request.getURI());  // WebSocket 요청 URI 로그 출력

        // 쿼리 파라미터에서 토큰 추출
        String token = request.getURI().getQuery(); // 쿼리 파라미터 전체 가져오기
        System.out.println("Request Query: " + token);  // 로그로 쿼리 파라미터 출력

        if (token != null && token.contains("access_token=")) {
            int startIndex = token.indexOf("access_token=") + "access_token=".length();
            int endIndex = token.indexOf("&", startIndex);
            if (endIndex == -1) {
                endIndex = token.length(); // 마지막 토큰일 경우 끝까지
            }
            token = token.substring(startIndex, endIndex); // access_token 값 추출
        }

        // 2. 토큰 검증
        if (token != null && jwtUtil.validateToken(token)) {
            String username = jwtUtil.extractUsername(token);
            if (username != null) {
                attributes.put("username", username); // 유저 정보를 WebSocket 세션에 저장
                return true; // 인증 성공
            }
        }

        System.err.println("WebSocket connection rejected: Invalid token");
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // 연결 후 작업
        System.out.println("WebSocket handshake completed"); // 핸드쉐이크 완료 로그
    }
}