import React, {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Card, CardContent, TextField, Typography} from "@mui/material";
import  type {TokenResponseDto} from "@/types/userType";
import {useRouter} from "next/navigation";
import {useFCM} from "@/hooks/useFcm";
const cookie = require("cookie");

export default function LoginScreen(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const loginHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const send = {
            email: email,
            password: password
        };
        try {
            const res = await axios.post<TokenResponseDto>("http://localhost:8080/api/auth/login", send);
            if (res.status !== 200) { console.log("로그인 실패" + res.data); }
            else { console.log("로그인 성공: ", res.data);
                document.cookie = cookie.serialize("refreshToken",res.data.refreshToken, {
                    path: '/',  // 쿠키 저장 경로
                    // httpOnly: true,  // 보안을 위해 JavaScript에서 접근 불가
                    httpOnly: false,  // 개발 환경상 어쩔 수 없음
                    // secure: process.env.NODE_ENV === 'production',  // 보안을 위해HTTPS 환경에서만
                    secure: false,  // 개발 환경은 http라서 false
                    sameSite: true  // CSRF 방지
                })
                document.cookie = cookie.serialize("accessToken",res.data.accessToken, {
                    path: '/',
                    httpOnly: false,
                    secure: false,
                    sameSite: true
                })
                document.cookie = cookie.serialize("userName",res.data.name, {
                    path: '/',  // 쿠키 저장 경로
                    httpOnly: false,
                    secure: false,
                    sameSite: true  // CSRF 방지
                })
                document.cookie = cookie.serialize("userGrade",res.data.userGrade, {
                    path: '/',  // 쿠키 저장 경로
                    httpOnly: false,
                    secure: false,
                    sameSite: true  // CSRF 방지
                })
                // 쿠키 설정 확인
                if (document.cookie.includes("userName=" + res.data.name)) {
                    // 쿠키 설정 확인됐으면 홈으로
                    window.location.href = "/user/logined";
                } else {
                    // 실패 처리
                    console.error("쿠키 설정 실패");
                }
            }
        } catch (e: unknown) {
            if(axios.isAxiosError(e)) {
                console.error("오류 상태 코드", e.response?.status);
                console.error("오류 메세지", e.response?.data);
                alert("로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해주세요.")
            } else { console.error("오류", (e as Error).message);}
            alert("로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해주세요.")
        }
    }

    return (
            <Card sx={{ width: "50%", minWidth:300, maxWidth:600,  margin: 4 }}>
                <Box
                    sx={{
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography  variant="h5">로그인</Typography>
                </Box>
                <CardContent>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="이메일"
                        name="email"
                        autoFocus
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="비밀번호"
                        type="password"
                        name="password"
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={loginHandler}
                    >
                        로그인
                    </Button>
                </CardContent>
            </Card>)
};