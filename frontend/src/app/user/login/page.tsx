// 로그인 페이지
"use client"
import {Box, Button, TextField} from "@mui/material";
import React, {useState} from "react";
import LoginScreen from "@/components/user/LoginScreen"
import PasswordChangeScreen from "@/components/user/PasswordChangeScreen";
import axios from "axios";
import {UsersDto} from "@/types/userType";

export default function page() {
    const [passwordUpdate, setPasswordUpdate] = useState(false);
    const [email, setEmail] = useState("");
    const [passwordQ, setPasswordQ] = useState("");
    const [passwordA, setPasswordA] = useState("");
    const [passwordQaSet, setPasswordQaSet] = useState(false);
    const passwordQaHandler = async () => {
        if(!passwordEmailCheck()) {return;}
        const data = {
            params: {
                email: email
            }
        };
        const res = await axios.get<UsersDto>("http://localhost:8080/api/auth/passwordqa", data);
        console.log("비밀번호 질답 통신 "+ res.data);
        if (res.status === 500) {
            alert("존재하지 않는 계정입니다.");
            return;
        } else {
            setPasswordQ(res.data.passwordQuestion);
            setPasswordA(res.data.passwordAnswer);
        }
    }
    const passwordChangeScreenAfter = () => {
        if (passwordQaSet) {
            return (
                <PasswordChangeScreen passwordQuestion={passwordQ}
                                      passwordAnswer={passwordA}
                                      setPasswordChange={setPasswordChange}
                                      email={email}
                />
            )
        } else {
            return (
                <Box>
                <TextField
                    label="이메일을 입력해주세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>

                </TextField>
                    <Button onClick={passwordQaHandler}>이메일 입력</Button>
                    <Button onClick={() => setPasswordUpdate(false)}>비밀번호 찾기 취소</Button>
                </Box>
            )
        }
    };
    const passwordEmailCheck = () => {
        if(email===null||email.trim().length===0) {
            alert("이메일을 입력해주세요."); return false;}
        else {
            setPasswordQaSet(true);
            return true;
        }
    }
    const setPasswordChange = (b:boolean) =>{
        if(b===false){
            setPasswordUpdate(false);
            setPasswordQaSet(false);
        }
    }

    return (
        <Box sx={{alignItems: "center", justifyItems: "center"}}>
            <LoginScreen/>
            {passwordUpdate ?
                passwordChangeScreenAfter()
                :
                <Button
                    onClick={() => setPasswordUpdate(true)}
                    variant="contained"
                    sx={{backgroundColor: "#FFA000"}}>
                    비밀번호 찾기
                </Button>}
        </Box>)
};