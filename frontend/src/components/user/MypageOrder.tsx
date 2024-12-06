
"use client"
import {Box, Button, Paper} from "@mui/material";
import {DataGrid, GridColDef, GridRowSelectionModel} from "@mui/x-data-grid";
import dayjs, {Dayjs} from "dayjs";
import type {ProductsDto} from "@/types/productType";
import {useEffect, useState} from "react";
import {OrderDto} from "@/types/orderType"
import {string} from "prop-types";
import useAuth from "@/scripts/auth/useAuth";
import authApi from "@/scripts/auth/authApi";
import {useRouter} from "next/navigation";

export default function MypageOrder( ){
    const [orders, setOrders] = useState<OrderDto[]|null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const router = useRouter();

    const paginationModel = {page: 0, pageSize: 10};

    const fetchData = async () => {
        try {
            const res = await authApi.get<OrderDto[]|null>("/orders/list");
            console.log(res.data);
            setOrders(res.data);

        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    if (!orders || orders.length === 0) {
        return (
            <Box sx={{ width: "100%", minWidth: 700}}>
                <Paper sx={{height: 400, width: '100%'}}>
                    주문 내역이 없습니다.
                </Paper>
            </Box>
        );
    }



    const rows = orders.map((order) => ({
        id: order.id,
        image: order.products.imageUrl,
        name: order.products.name,
        price: order.price,
        discount: order.discount,
        payPrice: order.payPrice,
        quantity: order.quantity,
        createdAt: dayjs(order.createdAt).format("YYYY-MM-DD hh:mm"),
    }));

    const columns: GridColDef[] = [
        { field: 'image', headerName: '상품 이미지', width: 150, renderCell:
                (params) =>
                    <img src={params.value} alt="product" style={{width: '100px', height: 'auto'}} /> },
        { field: 'name', headerName: '상품명', width: 120 },
        { field: 'price', headerName: '가격', width: 100 },
        { field: 'discount', headerName: '할인', width: 80 },
        { field: 'payPrice', headerName: '최종 가격', width: 100 },
        { field: 'quantity', headerName: '수량', width: 50 },
        { field: 'createdAt', headerName: '주문일', width: 180 },
    ];

    const deleteHandler = async (ids: number[]) => {
        if (ids.length === 0 || ids === null) {
            alert("제거를 원하시는 상품을 선택해주세요.");
            return;
        }

        try {
            const res = await authApi.post("/orders/hide", ids);
            if (res.status === 200) {
                alert("해당 주문이 제거되었습니다.");
                // 제거 후 장바구니 다시 불러오기
                setOrders(res.data);
            } else {
                alert("주문 제거에 실패했습니다.");
            }
        } catch (error) {
            console.error("API 요청 오류:", error);
            alert("주문 제거 중 오류가 발생했습니다.");
        }
    }

    return (
        <Box sx={{ width: "100%"}}>
            <Paper sx={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
                        setSelectedIds(newSelection as number[]);
                    }}
                    sx={{border: 0}}
                />
            </Paper>
            <Button onClick={()=>deleteHandler(selectedIds)}>
                선택 주문 목록에서 제거
            </Button>
        </Box>
    );
}