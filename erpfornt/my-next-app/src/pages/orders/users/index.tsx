import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { GetServerSideProps } from 'next'; // getServerSideProps import
import { orderListUser } from "@/api/api"; // API 호출 함수 import
import { OrdersDto } from "@/api/datatype";
import { useRouter } from 'next/navigation'; // next/router가 아님!
interface OrdersUsersPageProps {
    orders: OrdersDto[];
    error: string | null;
    id: string;
}

const OrdersUsersPage = ({ orders, error, id }: OrdersUsersPageProps) => {
    const [inputId, setInputId] = React.useState<string>(id); // 사용자 입력 ID 상태
    const router = useRouter();
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

    // 에러 발생 시 표시
    if (error) {
        return (
            <Typography color="error" variant="h6" align="center">
                {error}
            </Typography>
        );
    }

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
                <Button variant="contained" onClick={() => router.push(`/orders/user/${inputId}`)}>
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
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { id } = params as { id: string };
    let orders: OrdersDto[] = [];
    let error = null;

    try {
        orders = await orderListUser(Number(id)); // API 호출
    } catch (err:any) {
        error = err.message || 'Failed to fetch orders.';
    }

    return {
        props: {
            orders,
            error,
            id, // URL에서 받은 ID를 props로 전달
        },
    };
};

export default OrdersUsersPage;
