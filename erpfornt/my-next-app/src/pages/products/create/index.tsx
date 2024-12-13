import React, { useState } from 'react';
import { Button, TextField, Box, Grid, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const brands = [
        'Bosch', 'DeWalt', 'Festool', 'ES산업', '계양',
        'Milwaukee', 'Makita', 'LS전선', 'Hitachi', 'Stanley'
    ];
    const categories = [
        '목공공구', '용접공구', '원예공구', '수작업공구', '전동공구',
        '측정공구', '안전용품', '전기용품', '페인트용품', '공구세트'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name as string]: value });
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
                    <FormControl fullWidth>
                        <InputLabel id="category-label">카테고리</InputLabel>
                        <Select
                            labelId="category-label"
                            value={formData.category}
                            //@ts-ignore
                            onChange={handleChange}
                            name="category"
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="주요 상품 번호"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="mainItemNumber"
                        value={formData.mainItemNumber}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="이벤트"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="event"
                        value={formData.event}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="brand-label">브랜드</InputLabel>
                        <Select
                            labelId="brand-label"
                            value={formData.brand}
                            //@ts-ignore
                            onChange={handleChange}
                            name="brand"
                        >
                            {brands.map((brand) => (
                                <MenuItem key={brand} value={brand}>
                                    {brand}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="원가"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="파트너 ID"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="partnerId"
                        value={formData.partnerId}
                        onChange={handleChange}
                    />
                </Grid>
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
