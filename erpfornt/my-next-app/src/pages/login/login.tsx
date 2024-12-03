'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // next/router가 아님!

import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { login } from "../../api/api" ;
import {loginData} from "../../api/datatype";

/**
 * 로그인이라고 텍스트, 로그인 아이디 입력창, 패스워드 입력창, 로그인 버튼, 회원가입 버튼
 * 입력을 받아서 유효성 검사
 * 로그인 성공시 세션스토리지에 name, email, accessToken, refreshToken 받아서 저장
 * 저장완료 메시지 뜨고 3초후 메인페이지로 이동합니다 메시지나오고 대시보드 메인으로 복귀
 * @constructor
 */

export default function LoginPage(): JSX.Element {
    const [loginData, setLoginData] = useState<loginData>({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    // 입력 핸들러
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginData((prev:any) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 로그인 핸들러
    const handleLogin = async () => {
        try {
            setErrorMessage(null);
            setSuccessMessage(null);
            const response = await login(loginData);

            // 세션스토리지에 정보 저장
            sessionStorage.setItem('name', response.name);
            sessionStorage.setItem('email', response.email);
            sessionStorage.setItem('accessToken', response.accessToken);
            sessionStorage.setItem('refreshToken', response.refreshToken);

            setSuccessMessage('로그인 성공! 3초 후 메인 페이지로 이동합니다.');

            // 3초 후 메인 페이지로 이동
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error: any) {
            setErrorMessage(error.message || '로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
        }
    };

    // 회원가입 페이지 이동
    const handleSignupRedirect = () => {
        router.push('/signup');
    };

    return (
        <Box sx={{ p: 3, maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                로그인
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="이메일"
                        name="email"
                        type="email"
                        value={loginData.email}
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
                        value={loginData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
            </Grid>
            {errorMessage && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Typography>
            )}
            {successMessage && (
                <Typography color="primary" sx={{ mt: 2 }}>
                    {successMessage}
                </Typography>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    로그인
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleSignupRedirect}>
                    회원가입
                </Button>
            </Box>
        </Box>
    );
}
