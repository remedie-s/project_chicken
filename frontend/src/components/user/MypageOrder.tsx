
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
import timeStyle from "@/scripts/timeStyle";

export default function MypageOrder( ){
    const [orders, setOrders] = useState<OrderDto[]|null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const router = useRouter();

    const paginationModel = {page: 0, pageSize: 5};

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



    const rows = orders?.map((order) => ({
        id: order.id,
        image: order.products.imageUrl,
        name: order.products.name,
        price: order.price,
        discount: order.discount,
        payPrice: order.payPrice,
        quantity: order.quantity,
        createdAt: timeStyle(order.createdAt),
        productId: order.products.id,
        status: order.status,
        invoice: order.invoice||"미발송"
    }));

    const columns: GridColDef[] = [
        { field: "image", headerName: "상품 이미지", width: 100, renderCell:
                (params) =>
                    <img src={params.value} alt="product" style={{width: '80px', height: 'auto'}} /> },
        { field: "name", headerName: "상품명", width: 120 },
        { field: "price", headerName: "상품 가격", width: 100 },
        { field: "discount", headerName: "할인 금액", width: 80 },
        { field: "payPrice", headerName: "결제 금액", width: 100 },
        { field: "quantity", headerName: "수량", width: 50 },
        { field: "createdAt", headerName: "주문일", width: 140 },
        { field: "status", headerName: "주문 상태", width: 100 },
        { field: "invoice", headerName: "송장번호", width: 100 },
        {
            field: 'refundButton',
            headerName: "반품 신청",
            width: 100,
            renderCell: (params) => (
                <Button
                    sx = {{backgroundColor: "#000000", color: "#FFFFFF"}}
                    onClick={() => refundHandler(params.row.id)}>
                    반품
                </Button>
            )
        },
    ];

    const deleteHandler = async (ids: number[]) => {
        if (ids.length === 0 || !ids) {
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
    const refundHandler = async (id:number) => {
        if(!id){alert("반품하려는 상품 정보가 올바르지 않습니다."); return;}
        if(!confirm("정말 반품하시겠습니까?\n주문 상태에 따라 반품이 취소 처리될 수도 있습니다.")) {return;}
        try{
            const res = await authApi.post(`/orders/refund/${id}`);
            if (res.status!==200) {alert("반품 신청에 실패했습니다."); return;}
            setOrders(res.data);
        }
        catch (error) {
            alert("반품 신청 중 오류가 발생했습니다.");
        }
    }

    return (
        <Box sx={{ width: "100%"}}>
            <Paper sx={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
                        setSelectedIds(newSelection as number[]);
                    }}
                    onRowDoubleClick={(params) => {
                        const productId = params.row.productId;
                        router.push(`/product/detail/${productId}`); }}
                    localeText={{
                        noRowsLabel: "주문 내역이 없습니다."
                    }}
                    sx={{border: 0}}
                />
            </Paper>
            <Box sx={{marginTop: 2, display:"flex", alignItems: "flex-end", flexDirection: "column" }}>
            <Button onClick={()=>deleteHandler(selectedIds)} sx={{backgroundColor: "#000000", color: "#FFFFFF"}}>
                선택 상품 주문 목록에서 제거
            </Button>
            </Box>
        </Box>
    );
}