"use client"
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {DataGrid, GridColDef, GridRowSelectionModel} from "@mui/x-data-grid";
import {Dayjs} from "dayjs";
import type {ProductsDto} from "@/types/productType";
import {useEffect, useState} from "react";
import {OrderDto, OrderRequestType} from "@/types/orderType"
import authApi from "@/scripts/auth/authApi";
import type {CartsDto} from "@/types/cartType";
import {useRouter} from "next/navigation";
import GradeDiscountPrice from "@/scripts/GradeDiscountPrice";

export default function CartsList() {
    const [carts, setCarts] = useState<CartsDto[] | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const router = useRouter();
    const [editRowId, setEditRowId] = useState<number | null>(null);
    const [newQuantity, setNewQuantity] = useState<number>(1);

    const fetchData = async () => {
        try {
            const res = await authApi.get<CartsDto[] | null>("/carts/list");
            if (res.data) {
                adjustCartItems(res.data);
                setCarts(res.data);
            }
        } catch (error) {
            console.error("API 요청 오류:", error);
        }
    };

    const adjustCartItems = async (carts: CartsDto[]) => {
        for (const cart of carts) {
            if (cart.productsDto.stock > 0) {
                if (cart.quantity > cart.productsDto.stock) {
                    await saveQuantityChanges(cart.id, cart.productsDto.stock);
                    alert(`${cart.productsDto.name} 상품이 재고 부족으로 장바구니 수량이 조절됐습니다.`)
                }
            } else {
                await deleteCart([cart.id]);
                alert(`${cart.productsDto.name} 상품이 재고 부족으로 장바구니에서 제거됐습니다.`)

            }
        }
    };

    const saveQuantityChanges = async (id: number, quantity: number) => {
        try {
            const res = await authApi.post(`/carts/modify/${id}`, quantity);
            if (res.status === 200) {
                alert("수량이 변경되었습니다.");
                setCarts(res.data);
                setEditRowId(null);
            } else {
                alert("수량 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("API 요청 오류:", error);
            alert("수량 변경 중 오류가 발생했습니다.");
        }
    };

    const deleteCart = async (ids: number[]) =>{
        try {
            const res = await authApi.post("/carts/delete", ids);
            if (res.status === 200) {
                // 제거 후 장바구니 다시 불러오기
                setCarts(res.data);
            } else {
                alert("카트 제거에 실패했습니다.");
            }
        } catch (error) {
            console.error("API 요청 오류:", error);
            alert("카트 제거 중 오류가 발생했습니다.");
        }
    }

    const deleteHandler = async (ids: number[]) => {
        if (ids.length === 0 || ids === null) {
            alert("제거를 원하시는 상품을 선택해주세요.");
            return;
        }
        deleteCart(ids);
        alert("카트에서 상품이 제거되었습니다")
    }

    const orderHandler = (ids: number[]) => {
        if (ids.length === 0 || ids === null) {
            alert("구매를 원하시는 상품을 선택해주세요.");
            return;
        }
        // 선택된 ID들에 해당하는 cart 항목들을 필터링하여 selectedProductDtos 생성
        const selectedProductDtos: OrderRequestType[] = carts?.filter(cart => ids.includes(cart.id))
            .map(cart => ({
                productsDto: cart.productsDto, // productDto 그대로 저장
                quantity: cart.quantity       // 수량 저장
            })) || [];

        // sessionStorage에 selectedProductDtos 저장
        sessionStorage.setItem('orderData', JSON.stringify(selectedProductDtos));

        // 주문 페이지로 이동
        router.push("/order");
    }


    // 수량 변경 관련
    const handleQuantityEditClick = (id: number, currentQuantity: number) => {
        setEditRowId(id);
        setNewQuantity(currentQuantity);
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        const stock = carts?.find(cart => cart.id === editRowId)?.productsDto.stock || 0;
        if (value >= 1 && value <= stock) {
            setNewQuantity(value);
        } else {alert("장바구니 상품 수량은 최소 1개, 최대 현재 재고까지 가능합니다.")}
    };

    const handleQuantitySaveClick = async (id: number) => {
        saveQuantityChanges(id, newQuantity);
        alert("상품 수량이 변경됐습니다.")
    };

    useEffect(() => {
        fetchData();
    }, []);

    const paginationModel = {page: 0, pageSize: 10};

    // map으로 각 항목 값 배정
    const rows = carts?.map((cart) => ({
        id: cart.id,
        image: cart.productsDto.imageUrl,
        name: cart.productsDto.name,
        price: cart.productsDto.price,
        payPrice: GradeDiscountPrice(cart.productsDto.price)*(cart.quantity),
        quantity: cart.quantity,
        productsDto: cart.productsDto
    }));

    // 컬럼에 들어갈 값, 위에 올라오는 이름, 기본 넓이
    const columns: GridColDef[] = [
        {
            field: 'image', headerName: '상품 이미지', width: 150, renderCell:
                (params) =>
                    <img src={params.value} alt="product" style={{width: '100px', height: 'auto'}}/>
        },
        {field: 'name', headerName: '상품명', width: 120},
        {field: 'price', headerName: '가격', width: 100},
        {field: 'payPrice', headerName: '예상 결제 금액', width: 120},
        {
            field: 'quantity', headerName: '수량', width: 70, renderCell: (params) => {
                return params.row.id === editRowId ? (
                    <TextField
                        type="number"
                        value={newQuantity}
                        onChange={handleQuantityChange}
                        slotProps={{ htmlInput: { min: 1, max: params.row.productsDto.stock } }}
                    />
                ) : (
                    <span>{params.value}</span>
                );
            }
        },
        {
            field: 'quantityChangeButton',
            headerName: '수량 변경',
            width: 120,
            renderCell: (params) => {
                return params.row.id === editRowId ? (
                    <Button
                        sx = {{backgroundColor: "#000000", color: "#FFFFFF"}}
                        onClick={() => handleQuantitySaveClick(params.row.id)}>
                        변경 확인
                    </Button>
                ) : (
                    <Button
                        sx = {{backgroundColor: "#000000", color: "#FFFFFF"}}
                        onClick={() => handleQuantityEditClick(params.row.id, params.row.quantity)}>
                        수량 변경
                    </Button>
                );
            }
        },
        {
            field: 'orderButton',
            headerName: '제품 구매',
            width: 120,
            renderCell: (params) => (
                <Button
                    sx = {{backgroundColor: "#000000", color: "#FFFFFF"}}
                    onClick={() => orderHandler([params.row.id])}>
                    구매
                </Button>
            )
        },
        {
            field: 'deleteButton',
            headerName: '제품 제거',
            width: 120,
            renderCell: (params) => (
                <Button
                    sx = {{backgroundColor: "#000000", color: "#FFFFFF"}}
                    onClick={() => deleteHandler([params.row.id])}>
                    제거
                </Button>
            )
        }
    ];




    return (
        <Box sx={{width: "100%"}}>
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
                    localeText={{
                        noRowsLabel: "장바구니가 비어있습니다.",
                    }}
                    sx={{border: 0}}
                />
            </Paper>
            <Box sx={{display:"flex", alignItems: "flex-end", flexDirection: "column", marginY: 2}}>
                <Typography >
                    선택한 상품을
                </Typography>
                <Box>
                <Button onClick={() => deleteHandler(selectedIds)}
                        sx={{ backgroundColor: "#E00000", color: "#FFFFFF", marginRight:2}}>삭제</Button>
                <Button onClick={() => orderHandler(selectedIds)}
                sx={{ backgroundColor: "#FFDF00", color: "#000000"}}>구매</Button>
                </Box>
            </Box>
        </Box>
    );
}