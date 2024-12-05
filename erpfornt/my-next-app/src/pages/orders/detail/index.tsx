import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { orderDetail } from "@/api/api";
import { OrdersDto } from "@/api/datatype";

interface OrdersDetailPageProps {
    orderId: number;
    order: OrdersDto | null;
    error: string | null;
}

export default function OrdersDetailPage({ orderId, order, error }: OrdersDetailPageProps) {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (order) {
            setLoading(false);  // 이미 order 정보가 있다면 로딩을 종료
        }
    }, [order]);

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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { orderId } = params as { orderId: string };
    let order = null;
    let error = null;

    try {
        const data = await orderDetail(Number(orderId));  // orderId를 숫자로 변환
        order = data;
    } catch (err:any) {
        error = err.message;
    }

    return {
        props: {
            orderId: Number(orderId),
            order,
            error,
        },
    };
};
