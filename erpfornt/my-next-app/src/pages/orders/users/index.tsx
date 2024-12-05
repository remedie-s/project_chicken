import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { orderListUser, orderModify, orderDelete } from "@/api/api";
import {modifyOrderData, OrdersDto} from "@/api/datatype";

const OrdersUsersPage = () => {
    const [inputId, setInputId] = React.useState<string>(''); // 사용자 입력 ID 상태
    const [userOrders, setUserOrders] = React.useState<OrdersDto[]>([]); // 주문 데이터 상태
    const [loading, setLoading] = React.useState<boolean>(false); // 로딩 상태
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // 에러 메시지 상태

    // 상태 선택 옵션
    const statusOptions = ['준비', '접수', '발송', '도착', '완료'];

    // 데이터 그리드 컬럼 정의
    const columns: GridColDef<OrdersDto>[] = [
        { field: 'id', headerName: 'Order ID', width: 90 },
        { field: 'quantity', headerName: 'Quantity', width: 120, type: 'number' },
        { field: 'price', headerName: 'Price', width: 120, type: 'number' },
        { field: 'discount', headerName: 'Discount', width: 120, type: 'number' },
        { field: 'payPrice', headerName: 'Pay Price', width: 120, type: 'number' },
        { field: 'createdAt', headerName: 'Created At', width: 180 },
        { field: 'available', headerName: 'Available', width: 120, type: 'boolean' },
        {
            field: 'invoice',
            headerName: 'Invoice',
            width: 120,
            editable: true, // 편집 가능
        },
        { field: 'address', headerName: 'Address', width: 200 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            editable: true, // 편집 가능
            renderEditCell: (params: GridRenderEditCellParams) => (
                <Select
                    value={params.value || ''}
                    onChange={(e) => params.api.setEditCellValue({ id: params.id, field: 'status', value: e.target.value })}
                    sx={{ width: '100%' }}
                >
                    {statusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        //@ts-ignore
                        onClick={() => handleSave(params.row)}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        //@ts-ignore
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    // 데이터 검색 핸들러
    const handleSearch = async () => {
        if (!inputId) return;

        setLoading(true);
        setErrorMessage(null);
        try {
            const fetchedOrders = await orderListUser(Number(inputId));
            setUserOrders(fetchedOrders);
        } catch (err: any) {
            setUserOrders([]);
            setErrorMessage(err.message || 'Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    // 저장 핸들러
    const handleSave = async (row: modifyOrderData) => {
        try {
            const updatedOrder = await orderModify(row);
            setUserOrders((prev) =>
                prev.map((order) =>
                    order.id === updatedOrder.id ? updatedOrder : order
                )
            );
            alert(`Order ${row.id} updated successfully.`);
        } catch (err: any) {
            alert(`Failed to update order: ${err.message}`);
        }
    };

    const handleDelete = async (orderId: number) => {
        try {
            await orderDelete(orderId);
            setUserOrders((prev) =>
                prev.filter((order) => order.id !== orderId)
            );
            alert(`Order ${orderId} deleted successfully.`);
        } catch (err: any) {
            alert(`Failed to delete order ${orderId}: ${err.message}`);
        }
    };

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Search Orders by User ID
            </Typography>

            {/* 입력 필드와 검색 버튼 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TextField
                    label="User ID"
                    variant="outlined"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    disabled={loading}
                />
                <Button variant="contained" onClick={handleSearch} disabled={loading || !inputId}>
                    {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
            </Box>

            {/* 에러 메시지 */}
            {errorMessage && (
                <Typography color="error" variant="h6" align="center" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            {/* 데이터 그리드 */}
            {userOrders.length > 0 ? (
                <DataGrid
                    rows={userOrders}
                    columns={columns}
                    getRowId={(row) => row.id || Math.random()}
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
            ) : loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Typography variant="h6" align="center">
                    Enter a User ID to search for orders.
                </Typography>
            )}
        </Box>
    );
};

export default OrdersUsersPage;
