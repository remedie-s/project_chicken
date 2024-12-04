'use client';
import React, { useState } from 'react';
import { Button, TextField, Box, Grid, Typography } from '@mui/material';
import { productReg } from '@/api/api';
import { productRegData } from '@/api/datatype';

function Index(): JSX.Element {
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
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [error, setError] = useState<string | null>(null); // 오류 상태 관리

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await productReg(formData);
            alert('상품이 성공적으로 등록되었습니다!');
        } catch (error) {
            setError('상품 등록에 실패했습니다.');
        } finally {
            setLoading(false);
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
                        label="설명"
                        variant="outlined"
                        fullWidth
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="가격"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="이미지 URL"
                        variant="outlined"
                        fullWidth
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="재고"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="stock"
                        value={formData.stock}
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
                {/* 필요한 추가 필드 */}
            </Grid>
            <Box sx={{ marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? '등록 중...' : '등록'}
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleReset} sx={{ marginLeft: 2 }}>
                    초기화
                </Button>
                <Button variant="text" onClick={handleGoHome} sx={{ marginLeft: 2 }}>
                    메인화면
                </Button>
            </Box>
            {error && <Typography sx={{ color: 'error.main', mt: 2 }}>{error}</Typography>}
        </Box>
    );
}

export default Index;
