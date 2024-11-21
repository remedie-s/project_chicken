package org.example.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // 파트너사 이름
    private String name;
    // 파트너사 이메일
    private String email;
    // 파트너사 담당자 이름
    private String managerName;
    // 파트너사 핸드폰
    private String phone;
    // 파트너사 주소
    private String address;
    // 파트너사 웹사이트
    private String website;
    // 파트너사 내용 ex) 관계하고있는 분야
    private String description;
    // 미수금
    private Long outstanding;
    // 협력 시작일
    private LocalDateTime contactStart;
    // 협력 마무리일
    private LocalDateTime contactEnd;
    
    // 물품과 연결(주)
    @JsonIgnore
    @OneToMany(mappedBy = "partner", cascade = CascadeType.REMOVE)
    private List<Products> products;
    
}
