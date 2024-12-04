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
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //출근 시간(초과근무시 같은날 로그인 2번, 근무시간 8시간 오버이면 초과근무로 잡으면 될듯?)
    //TODO 휴가 엔티티를 하나 더 만들어서 로직으로 하루에 한번 휴가자는 휴가라고 입력되게 하면 되긴할듯 
    private LocalDateTime loginTime;
    //퇴근 시간
    private LocalDateTime logoutTime;
    // 휴가 여부 (leave 예약어라 에러남)
    private boolean leaveCompany;

    // 고용자 테이블과 연결
    @ManyToOne
    private Employee employee;

}
