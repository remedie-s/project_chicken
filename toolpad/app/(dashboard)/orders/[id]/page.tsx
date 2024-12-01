'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {orderDetail} from "@/app/api/api";
import {OrdersDto} from "@/app/types/datatype";
import {useParams} from "next/navigation";

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
    const { orderId } = useParams(); // Next.js의 useParams를 사용하여 productId 가져오기
    const [order, setOrder] = useState<OrdersDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!orderId) return; // orderId가 없으면 실행하지 않음

        const fetchOrder = async () => {
            try {
                const data = await orderDetail(Number(orderId));
                setOrder(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" variant="h6" align="center">
                {error}
            </Typography>
        );
    }

    if (!order) {
        return (
            <Typography variant="h6" align="center">
                Order not found.
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4">Order ID: {order.id}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Quantity: {order.quantity}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Price: ${order.price}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Pay Price: ${order.payPrice}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Status: {order.status}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
                Address: {order.address}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
                Invoice: {order.invoice}
            </Typography>
        </Box>
    );
}
