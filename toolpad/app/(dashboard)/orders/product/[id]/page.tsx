'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {useParams, useRouter} from 'next/navigation'; // useParams import
import { orderListProduct } from "@/app/api/api"; // API 호출 함수 import
import { OrdersDto } from "@/app/types/datatype";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

/**
 *     상품별 주문 페이지
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

export default function OrdersProductPage() {
    const [orders, setOrders] = React.useState<OrdersDto[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const [inputId, setInputId] = React.useState<string>(''); // 사용자 입력 ID 상태
    const { id } = useParams(); // 현재 경로의 id 가져오기
    const router = useRouter(); // 라우터 객체 생성
    // 데이터 가져오기
    React.useEffect(() => {
        if (!id) return; // id가 없으면 실행하지 않음

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await orderListProduct(Number(id)); // API 호출
                setOrders(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [id]);

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
                {error}
            </Typography>
        );
    }
    // ID로 이동 버튼 핸들러
    const handleSearch = () => {
        if (inputId.trim()) {
            router.push(`/orders/user/${inputId}`); // 입력된 ID를 경로에 반영하여 이동
        }
    };

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Orders for User ID: {id}
            </Typography>

            {/* 입력 필드와 버튼 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TextField
                    label="User ID"
                    variant="outlined"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)} // 입력값 변경
                />
                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
            </Box>

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
