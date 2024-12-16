package org.example.backend.utility;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.Users;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {
    // 액세스 토큰 키 및 만료시간
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private long expiration;

    // 리프레시 토큰 키 및 만료시간
    @Value("${jwt.secret}")
    private String secret1;
    @Value("${jwt.expiration1}")
    private long expiration1;

    // 액세스 토큰 서명 키 생성
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // 리프레시 토큰 서명 키 생성
    private Key getRefreshSigningKey() {
        return Keys.hmacShaKeyFor(secret1.getBytes());
    }

    // 액세스 토큰 생성
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 리프레시 토큰 생성
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration1))
                .signWith(getRefreshSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 액세스 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw e; // 예외를 다시 던져 필터에서 처리
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid access token: " + e.getMessage());
            return false;
        } catch (Exception e) {
            return false;
        }

    }

    // 리프레시 토큰 검증
    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getRefreshSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.err.println("Refresh token expired: " + e.getMessage());
            throw e; // 만료된 토큰 예외 처리
        } catch (MalformedJwtException e) {
            System.err.println("Malformed refresh token: " + e.getMessage());
        } catch (SignatureException e) {
            System.err.println("Invalid refresh token signature: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("Illegal argument in refresh token: " + e.getMessage());
        } catch (JwtException e) {
            System.err.println("Invalid refresh token: " + e.getMessage());
        }
        return false;
    }

    // 토큰에서 사용자 이름 추출
    public String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            // 토큰 만료 시 처리
            System.err.println("JWT expired: " + e.getMessage());
            throw new ExpiredJwtException(e.getHeader(), e.getClaims(), e.getMessage());
        } catch (JwtException | IllegalArgumentException e) {
            // JWT 형식 오류 또는 다른 예외 처리
            System.err.println("Failed to extract username: " + e.getMessage());
            return null;
        }
    }

    public void authenticateUser(Users users) {
        // Authentication 객체 생성
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(users, null, users.getAuthorities());

        // SecurityContext에 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 디버깅: 인증 정보 확인
        log.info("Authenticated user: {}", authentication.getPrincipal());
    }
}