// 로그인 페이지
"use client"
import {Box} from "@mui/material";
import React, {useState} from "react";
import LoginScreen from "@/components/user/LoginScreen"

export default function page(){
    return (
        <Box sx={{alignItems: "center", justifyItems: "center"}}>
            <LoginScreen/>
        </Box>)
};