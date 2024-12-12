package org.example.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Users {
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
    // 유저 등급(기본 0~3)
    private Integer userGrade;
    // 구매 수량
    private Long totalPurchaseCount;
    // 구매 가격
    private Long totalPurchasePrice;

    private String fcmToken;
    @Column(name="refresh_token")
    private String refreshToken;
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
}