import React, {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Card, CardContent, TextField, Typography} from "@mui/material";
import  type {TokenResponseDto} from "@/types/userType";
import {useRouter} from "next/navigation";
import {useFCM} from "@/hooks/useFcm";
import {setCookie} from "@/scripts/cookieScript";
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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
            const res = await axios.post<TokenResponseDto>(`${apiUrl}/auth/login`, send);
            if (res.status !== 200) { console.log("로그인 실패" + res.data); }
            else { console.log("로그인 성공: ");
                    setCookie("refreshToken", res.data.refreshToken, 3);
                    setCookie("accessToken", res.data.accessToken, 1);
                    setCookie("userName", res.data.name, 3);
                    setCookie("accessToken", res.data.accessToken, 1);
                    setCookie("userGrade", res.data.userGrade, 3);
                // 쿠키 설정 확인
                // 한글 이름이 URL 인코딩된 값으로 쿠키에 저장돼서 확인시 디코딩 거침
                const decodedCookie = decodeURIComponent(document.cookie);
                if (decodedCookie.includes(`userName=${res.data.name}`)) {
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
                        sx={{ mt: 3, mb: 2, backgroundColor: "#FFDF00", color: "#000000" }}
                        onClick={loginHandler}
                    >
                        로그인
                    </Button>
                </CardContent>
            </Card>)
};