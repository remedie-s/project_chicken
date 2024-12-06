package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.OrdersDto;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Users;
import org.example.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/list")
    public ResponseEntity<?> list(@AuthenticationPrincipal Users users) {
        List<OrdersDto> ordersDtos = this.orderService.ordersList(users);
        return ResponseEntity.ok(ordersDtos);
    }
    @GetMapping("/hidelist")
    public ResponseEntity<?> hidelist(@AuthenticationPrincipal Users users) {
        List<OrdersDto> ordersDtos = this.orderService.ordersListHide(users);
        return ResponseEntity.ok(ordersDtos);
    }
    @PostMapping("/refund/{orderId}")
    public ResponseEntity<?> refund(@PathVariable Long orderId, @AuthenticationPrincipal Users users) {
        Orders orders =this.orderService.findById(orderId);
        if(orders != null){
            if(orders.getUsers().getId()==users.getId()){
                if(this.orderService.refundOrder(orderId)){
                    List<OrdersDto> ordersDtos = this.orderService.ordersList(users);
                    return ResponseEntity.ok(ordersDtos);
                }
                return ResponseEntity.status(500).body("반품신청 오류입니다.");
            }
            return ResponseEntity.status(403).body("권한 없는 사용자의 요청입니다.");
        }
        return ResponseEntity.status(500).body("비어있는 주문 입니다.");
    }
    // 물건 주문
    @PostMapping("/add")
    public ResponseEntity<?> addOrder(@AuthenticationPrincipal Users users, @RequestBody OrdersDto[] ordersDtos) {
        if(this.orderService.orderAdd(users, ordersDtos)){
            return ResponseEntity.ok("주문 완료");
        }
        return ResponseEntity.status(500).body("주문 처리가 실패했습니다.");
    }
    // 주문 삭제(숨기기)
    @PostMapping("/hide")
    public ResponseEntity<?> hide(@AuthenticationPrincipal Users users,
                                  @RequestBody List<Long> orderIds) {
        if(this.orderService.orderChangeAvailable(users, orderIds)){
            List<OrdersDto> ordersDtos = this.orderService.ordersList(users);
            return ResponseEntity.ok(ordersDtos);
        }
        return ResponseEntity.status(500).body("주문 숨기기 변경 오류입니다.");
    }

}
