package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 스프링 시큐리티 구현시 메인될 유저 클래스는 1개여야해서 이런식으로 구현
 */
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private LocalDateTime createdAt;
    private String gender;
    private String phoneNumber;
    private String address;
    private LocalDate birthDate;
    private Integer userGrade;
    private Long totalPurchaseCount;
    private Long totalPurchasePrice;
    private String passwordQuestion;
    private String passwordAnswer;

    @Column(name = "refresh_token")
    private String refreshToken;

    // 생성자
    public Users(String name, String email, String password, String gender, String address, LocalDate birthDate, String passwordQuestion, String passwordAnswer, String phoneNumber) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
        this.gender = gender;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.passwordQuestion = passwordQuestion;
        this.passwordAnswer = passwordAnswer;
        this.birthDate = birthDate;
        this.userGrade = 0;
        this.totalPurchaseCount = 0L;
        this.totalPurchasePrice = 0L;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "users", cascade = CascadeType.REMOVE)
    private List<ProductCustomers> productCostomers;
    @JsonIgnore
    @OneToMany(mappedBy = "users", cascade = CascadeType.REMOVE)
    private List<Carts> carts;
    @JsonIgnore
    @OneToMany(mappedBy = "users", cascade = CascadeType.REMOVE)
    private List<Orders> orders;
    @JsonIgnore
    @OneToMany(mappedBy = "users", cascade = CascadeType.REMOVE)
    private List<Questions> questions;
    @JsonIgnore
    @OneToMany(mappedBy = "users", cascade = CascadeType.REMOVE)
    private List<ProductReviews> productReviews;
    @JsonIgnore
    @OneToMany(mappedBy = "users", cascade = CascadeType.REMOVE)
    private List<Answers> answers;

    // UserDetails에서 요구하는 메서드들 구현

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 사용자의 권한을 설정. 예시로 ROLE_USER 권한을 부여합니다.
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email; // 이메일을 사용자 이름으로 설정
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정 만료 여부 (기본값: false)
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠금 여부 (기본값: false)
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 자격 증명 만료 여부 (기본값: false)
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정 활성화 여부 (기본값: false)
    }
}