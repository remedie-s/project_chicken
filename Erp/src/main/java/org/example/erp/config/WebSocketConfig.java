package org.example.erp.config;

import org.example.erp.utility.WebSocketAuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    public WebSocketConfig(WebSocketAuthInterceptor webSocketAuthInterceptor) {
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:3001","https://localhost:3000", "https://localhost:3001","https://192.168.0.11:3000",
                        "https://192.168.0.11:3001", // Erp 클라이언트
                        "https://192.168.0.11:8080",
                        "https://192.168.0.11:8081",  // 추가 허용 포트
                        "http://192.168.0.11:3000",
                        "http://192.168.0.11:3001", // Erp 클라이언트
                        "http://192.168.0.11:8080",
                        "http://192.168.0.11:8081")
                .addInterceptors(webSocketAuthInterceptor)
                .withSockJS();
    }
}
