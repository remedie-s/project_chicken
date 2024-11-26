// 가입 페이지
"use client"

import {
    Box,
    Button,
    Card,
    CardContent, FormControl,
    Grid2,
    Input, InputLabel, MenuItem,
    OutlinedInput,
    Select, SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import axios, {Axios, AxiosError} from "axios";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import type {userDto} from "@/types/userType"
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export default function register(){
    const [passwordQ, setPasswordQ] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordA, setPasswordA] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [birthday,setBirthday] = useState(dayjs());
    const [address, setAddress] = useState("");


    const questionChange = (e:SelectChangeEvent) => {
        setPasswordQ(e.target.value as string);
    };

    const genderChange = (e:SelectChangeEvent) => {
        setGender(e.target.value as string);
    };
    const birthdayChange = (date:Dayjs|null) =>{
        if (date) { setBirthday(date); }
    }


    const registerHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const send = {
            name: name,
            email: email,
            password: password,
            gender: gender,
            address: address,
            birthDate: birthday,
            passwordQuestion: passwordQ,
            passwordAnswer: passwordA
        };
        try {
            const res = await axios.post("http://localhost:8080/api/auth/register", send);
            if (res.status !== 200) { console.log("가입실패" + res.data); }
            else { console.log("회원가입 성공: ", res.data); }
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
                <Typography  variant="h5">회원가입</Typography>
                </Box>
                <CardContent>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="이메일(아이디)"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                helperText="*필수 입력"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="비밀번호"
                                type="password"
                                id="password"
                                helperText="*필수 입력"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="비밀번호 확인"
                                type="password"
                                id="confirmPassword"
                                helperText={password && password==confirmPassword? "":"비밀번호와 일치하지 않습니다" }
                            />
                            <FormControl fullWidth margin="normal" required>
                            <InputLabel id="passwordQLabel">비밀번호 변경시 질문</InputLabel>
                            <Select
                                labelId="passwordQLabel"
                                required
                                fullWidth
                                id="passwordQ"
                                value={passwordQ}
                                label="비밀번호 변경시 질문"
                                onChange={questionChange}
                            >
                                <MenuItem value={"book"}>가장 좋아하는 책의 이름은 무엇인가요?</MenuItem>
                                <MenuItem value={"animal"}>가장 좋아하는 동물의 이름은 무엇인가요?</MenuItem>
                                <MenuItem value={"movie"}>가장 좋아하는 영화 제목은 무엇인가요?</MenuItem>
                                <MenuItem value={"color"}>가장 좋아하는 색깔은 무엇인가요?</MenuItem>
                                <MenuItem value={"food"}>가장 좋아하는 음식은 무엇인가요?</MenuItem>
                            </Select>
                            </FormControl>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="security-answer"
                                label="비밀번호 변경시 정답"
                                id="security-answer"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="이름"
                                name="name"
                            />
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel id="genderLabel">성별</InputLabel>
                                <Select
                                    labelId="genderLabel"
                                    required
                                    fullWidth
                                    id="gender"
                                    value={gender}
                                    label="성별"
                                    onChange={genderChange}
                                >
                                    <MenuItem value={"male"}>남</MenuItem>
                                    <MenuItem value={"female"}>여</MenuItem>
                                </Select>
                            </FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker onChange={(date) =>birthdayChange(date)} value={birthday} />
                            </LocalizationProvider>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="address"
                                label="주소"
                                name="address"
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={registerHandler}
                            >
                                회원가입
                            </Button>
                        </Box>
                </CardContent>
            </Card>
        </Box>)
};