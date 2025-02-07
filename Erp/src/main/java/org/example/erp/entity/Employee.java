package org.example.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Employee implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // 이름
    private String name;
    // 이메일
    private String email;
    // 비밀번호
    private String password;
    // 가입일(현재시간)
    private LocalDateTime createdAt;
    // 성별(남/여)
    private String gender;
    // 주소
    private String address;
    // 태어난 날 (나이를 받으려고했으나, 시간이 지남에따라 자동 계산해야하므로 변경)
    private LocalDate birthDate;
    // 전화번호
    private String phoneNumber;
    // 부서
    private String department;
    // 직급
    private String position;
    // 연봉
    private Long salary;
    // 인센티브
    private Long incentive;
    // 고용일
    private LocalDate hireDate;
    // 사퇴일
    private LocalDate resignationDate;
    // 연가 남아있는 날짜
    private double annualLeave;
    // 근무 평점(100점 만점)
    private Integer rating;
    // 근퇴 여부 테이블과 연결
    // 근태와의 관계 (1:N)
    // FCM 토큰 추가
    private String fcmToken;
    @Column(name="refresh_token")
    private String refreshToken;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "employee_roles", joinColumns = @JoinColumn(name = "employee_id"))
    @Enumerated(EnumType.STRING)
    private List<Role> roles = new ArrayList<>();


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    


}
