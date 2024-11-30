'use client';


import { Button, TextField, Box, Grid, Typography } from '@mui/material';
import {productReg } from '../../../api/api';
import {productRegData} from "@/app/types/datatype";
import {useState} from "react"; // api 파일에서 호출하는 함수 임포트

/**
 *     id?: number|null;
 *     name: string;
 *     description: string;
 *     price: number;
 *     createdAt: string; // LocalDateTime은 ISO 8601 형식의 문자열로 변환할 수 있습니다.
 *     imageUrl: string;
 *     stock: number;
 *     sellCount: number;
 *     category: string;
 *     mainItemNumber: number;
 *     event: number;
 *     brand: string;
 *     cost: number;
 *     partnerId: number; // Partner는 별도의 타입으로 정의해야 합니다.
 *     각 항목당 입력창 있어야함
 *     버튼 3개 : 등록, 초기화, 메인화면으로 이동
 *
 * @constructor
 */


export default function ProductCreatePage(): JSX.Element {
    const [formData, setFormData] = useState<productRegData>({
        name: '',
        description: '',
        price: 0,
        createdAt: '',
        imageUrl: '',
        stock: 0,
        sellCount: 0,
        category: '',
        mainItemNumber: 0,
        event: 0,
        brand: '',
        cost: 0,
        partnerId: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await productReg(formData);
            alert('상품이 성공적으로 등록되었습니다!');
        } catch (error) {
            alert('상품 등록에 실패했습니다.');
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            createdAt: '',
            imageUrl: '',
            stock: 0,
            sellCount: 0,
            category: '',
            mainItemNumber: 0,
            event: 0,
            brand: '',
            cost: 0,
            partnerId: 0,
        });
    };

    const handleGoHome = () => {
        // 메인화면으로 이동하는 로직 (예: React Router 사용 시)
        window.location.href = '/';
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                상품 등록
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="상품명"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="상품 설명"
                        variant="outlined"
                        fullWidth
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="가격"
                        variant="outlined"
                        type="number"
                        fullWidth
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="이미지 URL"
                        variant="outlined"
                        fullWidth
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="재고"
                        variant="outlined"
                        type="number"
                        fullWidth
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="판매량"
                        variant="outlined"
                        type="number"
                        fullWidth
                        name="sellCount"
                        value={formData.sellCount}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="카테고리"
                        variant="outlined"
                        fullWidth
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="메인 상품 번호"
                        variant="outlined"
                        type="number"
                        fullWidth
                        name="mainItemNumber"
                        value={formData.mainItemNumber}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="이벤트"
                        variant="outlined"
                        type="number"
                        fullWidth
                        name="event"
                        value={formData.event}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="브랜드"
                        variant="outlined"
                        fullWidth
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="원가"
                        variant="outlined"
                        type="number"
                        fullWidth
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="파트너 ID"
                        variant="outlined"
                        type="number"
                        fullWidth
                        name="partnerId"
                        value={formData.partnerId}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>

            <Box sx={{ marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    등록
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleReset} sx={{ marginLeft: 2 }}>
                    초기화
                </Button>
                <Button variant="text" onClick={handleGoHome} sx={{ marginLeft: 2 }}>
                    메인화면
                </Button>
            </Box>
        </Box>
    );
}