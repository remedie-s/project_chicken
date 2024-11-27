// 가입 페이지
"use client"

import {
    Box
} from "@mui/material";
import React, {useState} from "react";
import RegisterScreen from "@/components/user/RegisterScreen"

export default function register(){
    return (
        <Box sx={{alignItems: "center", justifyItems: "center"}}>
            <RegisterScreen/>
        </Box>)
};