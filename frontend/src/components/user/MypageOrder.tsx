import {Box} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Dayjs} from "dayjs";
import type {ProductsDto} from "@/types/productType";
import {useEffect} from "react";
import {OrderDto} from "@/types/orderType"
import {string} from "prop-types";
type OrderlistType = {
    orders: OrderDto[]|null
}


export default function MypageOrder( {orders}:OrderlistType ){
    if (!orders || orders.length === 0) {
        return (
            <Box>
                주문 내역이 없습니다.
            </Box>
        );
    }


    const rows = orders.map((order) => ({
        id: order.id,
        image: order.products.imageUrl, // 첫 번째 제품의 이미지를 예시로 사용
        name: order.products.name,
        price: order.price,
        discount: order.discount,
        payPrice: order.payPrice,
        quantity: order.quantity,
        createdAt: order.createdAt.format('YYYY-MM-DD'),
    }));

    const columns: GridColDef[] = [
        { field: 'image', headerName: '이미지', width: 150, renderCell: (params) => <img src={params.value} alt="product" style={{width: '100px', height: 'auto'}} /> },
        { field: 'price', headerName: '가격', width: 130 },
        { field: 'discount', headerName: '할인', width: 130 },
        { field: 'payPrice', headerName: '최종 가격', width: 130 },
        { field: 'quantity', headerName: '수량', width: 130 },
        { field: 'createdAt', headerName: '주문 날짜', width: 180 },
    ];

    return (
        <Box>
            <DataGrid rows={rows} columns={columns} />
        </Box>
    )
}