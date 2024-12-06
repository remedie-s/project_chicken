// 결제 페이지
"use client"
import {DataGrid, GridColDef, GridRowSelectionModel} from "@mui/x-data-grid";
import {Box, Button, Paper} from "@mui/material";
import {useState, useEffect} from "react";
import type {CartsDto} from "@/types/cartType";
import {OrderDto, OrderRequestType} from "@/types/orderType";
import authApi from "@/scripts/auth/authApi";
import {ProductsDto} from "@/types/productType";
import {useRouter} from "next/navigation";
import LoadingScreen from "@/components/layout/LoadingScreen";
import gradeDiscountPrice from "@/scripts/GradeDiscountPrice";
import useAuth from "@/scripts/auth/useAuth";

type orderProduct = {
    productId:number,
    price: number
}

export default function odrerPage() {
    const [orderRequest, setOrderRequest] = useState<OrderRequestType[]>()
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return <LoadingScreen/>;
    }


    useEffect(() => {
        // sessionStorage에서 주문 데이터 읽기
        const storedData = sessionStorage.getItem("orderData");
        if (storedData) {
            try {
                // JSON 파싱하여 orderData 상태에 저장
                const parsedData: OrderRequestType[] = JSON.parse(storedData);
                setOrderRequest(parsedData);
            } catch (error) {
                console.error("주문 데이터 파싱 오류:", error);
                alert("주문 정보가 올바르지 않습니다.");
                router.push("/");
            }
        } else {
            alert("주문 정보가 없습니다.");
            router.push("/");
        }
    }, []);


    if (!orderRequest) {
        return (
            <LoadingScreen/>
        );  // 또는 로딩 스피너나 placeholder 화면을 보여줄 수 있습니다.
    }


    const rows = orderRequest.map((order: OrderRequestType) => ({
        id: order.productsDto.id,
        image: order.productsDto.imageUrl,
        name: order.productsDto.name,
        price: order.productsDto.price,
        payPrice: gradeDiscountPrice(order.productsDto.price)*(order.quantity),  // 할인 적용된 가격
        quantity: order.quantity,
    }));

    // 컬럼에 들어갈 값, 위에 올라오는 이름, 기본 넓이
    const columns: GridColDef[] = [
        { field: 'image', headerName: '상품 이미지', width: 150, renderCell:
                (params) =>
                    <img src={params.value} alt="product" style={{width: '100px', height: 'auto'}} /> },
        { field: 'name', headerName: '상품명', width: 120 },
        { field: 'price', headerName: '가격', width: 100 },
        { field: 'payPrice', headerName: '실결제 금액', width: 100 },
        { field: 'quantity', headerName: '수량', width: 50 }
    ];

    // 주문
    const orderHandler = async () => {
        // API에 보낼 주문 데이터 구성
        const ordersDtos = orderRequest.map(order => ({
            quantity: order.quantity,
            price: order.productsDto.price*(order.quantity),
            payPrice: gradeDiscountPrice(order.productsDto.price)*(order.quantity),
            productsDto: order.productsDto
        }));
        console.log(ordersDtos);
        try {
            const res = await authApi.post("/orders/add", ordersDtos);
            if (res.status !== 200) {
                alert("결제가 제대로 이뤄지지 않았습니다.");
                return;
            }
            sessionStorage.removeItem("orderData");
            alert("주문이 완료되었습니다.");
            // 결제 완료 후 필요한 처리 (리다이렉트 등)
            router.push("/user/mypage")
        } catch (error) {
            console.error("주문 중 오류:", error);
            alert("주문 처리 중 오류가 발생했습니다.");
        }
    };

    // 주문 취소
    const orderCancleHandler = async () =>{
        // 세션 스토리지에서 주문 정보 제거
        sessionStorage.removeItem("orderData");
        // 뒤로
        router.back();
    }

    const paginationModel = {page: 0, pageSize: 10};



    return (
        <Box sx={{width: "100%"}}>
            <Paper sx={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    pageSizeOptions={[10, 20]}
                    sx={{border: 0}}
                />
            </Paper>
            <Box>
                <Button onClick={orderCancleHandler}>구매 취소</Button>
                <Button onClick={orderHandler}>구매</Button>
            </Box>
        </Box>
    )
}