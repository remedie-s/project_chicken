package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.CartsDto;
import org.example.backend.dto.OrdersDto;
import org.example.backend.entity.Users;
import org.example.backend.service.CartsService;
import org.springframework.data.domain.jaxb.SpringDataJaxb;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/carts")
public class CartsController {

    private final CartsService cartsService;

    // 카트 리스트 보기
    @GetMapping("/list")
    public ResponseEntity<?> cartList(@AuthenticationPrincipal Users users){
        log.info("{}의 카트 리스트 요청입니다",users);
        List<CartsDto> carts = this.cartsService.getCarts(users);
        return ResponseEntity.ok(carts);
    }
    // 카트 물품 변경 메소드 0이하 안됨
    @PostMapping("/modify/{cartsId}")
    public ResponseEntity<?> modifyCart(@AuthenticationPrincipal Users users,
                                        @PathVariable Long cartsId,@RequestBody Long quantity){
        if(this.cartsService.modifyCarts(users, cartsId, quantity)){
            return ResponseEntity.ok(this.cartsService.getCarts(users));
        }else {
            return ResponseEntity.status(500).body("카트 변경 오류입니다.");
        }
    }
    
    // 카트 삭제 메소드
    @PostMapping("/delete")
    public ResponseEntity<?> deleteCart(@RequestBody List<Long> cartIds, @AuthenticationPrincipal Users users){
        if(this.cartsService.deleteCarts(cartIds)){
            List<CartsDto> carts = this.cartsService.getCarts(users);
            return ResponseEntity.ok(carts);
        }
        return ResponseEntity.status(500).body("카트 삭제 오류입니다.");
    }

    // 카트에서 주문하기 메소드
    @PostMapping("/order")
    public ResponseEntity<?> orderCart(@AuthenticationPrincipal Users users,
                                       @Valid @RequestBody OrdersDto ordersDto){
        log.info("카트에서 주문 요청이 들어왔어요.");
        if(this.cartsService.cartToOrders(users, ordersDto)){
            List<CartsDto> carts = this.cartsService.getCarts(users);
            return ResponseEntity.ok(carts);
        }
        return ResponseEntity.status(500).body("주문 등록 오류입니다.");
    }
    // 카트 물품 추가
    @PostMapping("/add")
    public ResponseEntity<?> addCart(@AuthenticationPrincipal Users users,
                                     @Valid @RequestBody CartsDto cartsDto){
        if(this.cartsService.addCarts(users,cartsDto)){
            return ResponseEntity.ok(cartsDto);
        }else {
            return ResponseEntity.status(500).body("장바구니 정보 생성 실패");
        }
    }
}
