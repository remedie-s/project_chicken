'use client';

import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, MenuItem } from '@mui/material';
import { signup } from '@/app/api/api';
import {signupData} from "@/app/types/datatype";

/**
 * 회원가입
 * 회원가입이라고 텍스트,
 * 입력창 : email, name, password, gender, address, birthDate, phoneNumber, department, position, salary, incentive, hireDate
 * 버튼 : 초기화 버튼, 회원가입 버튼, 메인페이지로 돌아가는 버튼
 * @constructor
 */




export default function SignupPage(): JSX.Element {
    const [formData, setFormData] = useState<signupData>({
        email: '',
        name: '',
        password: '',
        gender: 'male',
        address: '',
        birthDate: '',
        phoneNumber: '',
        department: '',
        position: '',
        salary: 0,
        incentive: 0,
        hireDate: '',
    });

    // 입력 필드 변경 핸들러
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevData:any) => ({
            ...prevData,
            [name]: name === 'salary' || name === 'incentive' ? parseFloat(value) : value,
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async () => {
        try {
            await signup(formData);
            alert('회원가입이 성공적으로 완료되었습니다.');
            handleReset();
        } catch (error: any) {
            alert(`회원가입 실패: ${error}`);
        }
    };

    // 초기화 핸들러
    const handleReset = () => {
        setFormData({
            email: '',
            name: '',
            password: '',
            gender: 'male',
            address: '',
            birthDate: '',
            phoneNumber: '',
            department: '',
            position: '',
            salary: 0,
            incentive: 0,
            hireDate: '',
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                회원가입
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="이메일"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="이름"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="비밀번호"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        label="성별"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="male">남성</MenuItem>
                        <MenuItem value="female">여성</MenuItem>
                        <MenuItem value="other">기타</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="주소"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="생년월일"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="전화번호"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="부서"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="직위"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="연봉"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="성과금"
                        name="incentive"
                        type="number"
                        value={formData.incentive}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="입사일"
                        name="hireDate"
                        type="date"
                        value={formData.hireDate}
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
                    회원가입
                </Button>
                <Button variant="outlined" href="/">
                    메인페이지로 돌아가기
                </Button>
            </Box>
        </Box>
    );
}