package org.example.erp.utility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

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
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid access token: " + e.getMessage());
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
        } catch (SignatureException e) {
            System.err.println("Invalid refresh token signature: " + e.getMessage());
        } catch (JwtException | IllegalArgumentException e) {
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
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Failed to extract username: " + e.getMessage());
            return null;
        }
    }
}
