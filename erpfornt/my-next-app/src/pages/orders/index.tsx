'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { orderList } from "@/api/api" ;
import {OrdersDto} from "@/api/datatype"; // API 호출 함수
/**
 * 주문 관리 페이지
 * 주문 리스트 나와야함
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
 *
 * @constructor
 */

export default function Index() {
    const [orders, setOrders] = React.useState<OrdersDto[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    // 데이터 가져오기
    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await orderList(); // API 호출
                setOrders(data);
            } catch (err: any) {
                setError(err instanceof Error ? err.message : "Failed to fetch orders."); // 에러 메시지 처리
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // 컬럼 정의
    const columns: GridColDef<OrdersDto>[] = [
        { field: 'id', headerName: 'Order ID', width: 90 },
        { field: 'quantity', headerName: 'Quantity', width: 120, type: 'number' },
        { field: 'price', headerName: 'Price', width: 120, type: 'number' },
        { field: 'discount', headerName: 'Discount', width: 120, type: 'number' },
        { field: 'payPrice', headerName: 'Pay Price', width: 120, type: 'number' },
        { field: 'createdAt', headerName: 'Created At', width: 180 },
        { field: 'available', headerName: 'Available', width: 120, type: 'boolean' },
        { field: 'invoice', headerName: 'Invoice', width: 120, type: 'number' },
        { field: 'address', headerName: 'Address', width: 200 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'userId', headerName: 'User ID', width: 120 },
        { field: 'productId', headerName: 'Product ID', width: 120 },
    ];

    // 로딩 중일 때 표시
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 에러 발생 시 표시
    if (error) {
        return (
            <Typography color="error" variant="h6" align="center">
                {error} {/* 에러 메시지 표시 */}
            </Typography>
        );
    }

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Order Details
            </Typography>
            <DataGrid
                rows={orders}
                columns={columns}
                getRowId={(row) => row.id || Math.random()} // ID가 없는 경우 fallback 처리
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}