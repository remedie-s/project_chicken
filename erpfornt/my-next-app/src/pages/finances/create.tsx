'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, MenuItem } from '@mui/material';
import { createInnerFianceData } from "../../api/api" ;
import {FianceDto} from "../../api/datatype";

/**
 * 신규 거래처 등록
 *      id?: number|null;
 *     name: string;
 *     description: string;
 *     buyPrice: number;
 *     sellPrice: number;
 *     currentPrice: number;
 *     status: "good" | "normal" | "bad"; // Enum-like for status
 *     buyTime: string; // LocalDateTime will be represented as an ISO string
 *     sellTime: string; // LocalDateTime will be represented as an ISO string
 *     항목당 입력창 있어야함
 *     맨아래 등록 , 초기화, 메인페이지로 버튼
 * @constructor
 */



export default function FinancesCreate(): JSX.Element {
    const [fianceData, setFianceData] = useState<FianceDto>({
        id: null,
        name: '',
        description: '',
        buyPrice: 0,
        sellPrice: 0,
        currentPrice: 0,
        status: 'normal',
        buyTime: '',
        sellTime: '',
    });

    // 입력 필드 변경 핸들러
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFianceData((prevData) => ({
            ...prevData,
            [name]: name === 'buyPrice' || name === 'sellPrice' || name === 'currentPrice' ? parseFloat(value) : value,
        }));
    };

    // 상태 선택 핸들러
    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFianceData((prevData) => ({
            ...prevData,
            status: event.target.value as 'good' | 'normal' | 'bad',
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async () => {
        try {
            await createInnerFianceData(fianceData);
            alert('거래처가 성공적으로 등록되었습니다.');
            handleReset(); // 초기화
        } catch (error) {
            alert(`등록 실패: ${error}`);
        }
    };

    // 초기화 핸들러
    const handleReset = () => {
        setFianceData({
            id: null,
            name: '',
            description: '',
            buyPrice: 0,
            sellPrice: 0,
            currentPrice: 0,
            status: 'normal',
            buyTime: '',
            sellTime: '',
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                신규 거래처 등록
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="거래처 이름"
                        name="name"
                        value={fianceData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="설명"
                        name="description"
                        value={fianceData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="매입가"
                        name="buyPrice"
                        type="number"
                        value={fianceData.buyPrice}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="판매가"
                        name="sellPrice"
                        type="number"
                        value={fianceData.sellPrice}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="현재가"
                        name="currentPrice"
                        type="number"
                        value={fianceData.currentPrice}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="상태"
                        name="status"
                        value={fianceData.status}
                        onChange={handleStatusChange}
                        fullWidth
                    >
                        <MenuItem value="good">Good</MenuItem>
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="bad">Bad</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="매입 시간"
                        name="buyTime"
                        type="datetime-local"
                        value={fianceData.buyTime}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="판매 시간"
                        name="sellTime"
                        type="datetime-local"
                        value={fianceData.sellTime}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" color="secondary" onClick={handleReset}>
                    초기화
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    등록
                </Button>
                <Button variant="outlined" href="/">
                    메인페이지로
                </Button>
            </Box>
        </Box>
    );
}
