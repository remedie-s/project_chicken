import * as React from 'react';
import Typography from '@mui/material/Typography';

/**
 *     id: number;
 *     quantity: number;          // 주문 수량
 *     price: number;             // 주문 시 원가격
 *     discount: number;          // 주문 시 할인 가격
 *     payPrice: number;          // 주문 시 실제 최종 가격
 *     createdAt: string;         // 주문 일자 (ISO 문자열)
 *     available: boolean;        // 숨김 여부
 *     invoice: number;           // 배송 번호 (운송장 번호)
 *     address: string;           // 배송지
 *     status: string;            // 주문 상태
 *     userId: number;            // 사용자 ID
 *     productId: number;         // 상품 ID
 * @constructor
 */

export default function OrdersDetailPage() {
  

  return (
    <Typography>
      Welcome to the Toolpad orders!
    </Typography>
  );
}
