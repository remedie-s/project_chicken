// 로그인 페이지
"use client"
import {Box, Button, Card, CardContent, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import axios from "axios";

export default function page(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const loginHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const send = {
            email: document.getElementById("email"),
            password: document.getElementById("password")
        };
        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", send);
            if (res.status !== 200) { console.log("로그인 실패" + res.data); }
            else { console.log("로그인 성공: ", res.data); }
        } catch (e: unknown) {
            if(axios.isAxiosError(e)) {
                console.error("오류 상태 코드", e.response?.status);
                console.error("오류 메세지", e.response?.data);
            } else { console.error("오류", (e as Error).message);}
        }
    }
    
    return (
        <Box sx={{alignItems: "center", justifyItems: "center"}}>
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
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="비밀번호"
                        name="password"
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
            </Card>
        </Box>)
};