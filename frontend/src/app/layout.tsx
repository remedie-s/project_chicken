"use client"

import {Box} from "@mui/material";
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import {Children, useEffect, useRef, useState} from "react";
import React, {ReactNode} from 'react'
import Navbar from "@/components/layout/Navbar";
import '@/styles/globals.css';
import {useRouter} from "next/navigation";
import LoadingScreen from "@/components/layout/LoadingScreen";
import BrandTab from "@/components/layout/BrandTab";
const cookie = require("cookie");

type layoutChildren = {
    children: ReactNode
}

export default function layout({children}: layoutChildren) {
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("useEffect 실행")
        const cookies = document.cookie ? cookie.parse(document.cookie) : {};
        const loginUser = cookies.userName || null;
        if (loginUser) {
            setUserName(loginUser);
        }
        setLoading(false)
        console.log("useEffect 완료")
    }, [])

    if (loading) {
        return (
            <LoadingScreen/>)
    }

    return (

        <html>
        <head>
            <title>ToolBox</title></head>
        <body>
        <Box sx={{
            // 최소 화면 높이가 브라우저 100%
            minHeight: "100vh",
            // 브라우저 컨텐츠 관리용
            display: "flex",
            // 세로 방향으로 배치
            flexDirection: "column",
            // 스크롤 가능
            overflow: "auto",
            position: "relative",
        }}
        >
            {/* 상단 검색창, 로그인 등 */}
            <Header userName={userName}/>
            {/* 카테고리 바 */}
            <Navbar/>
            {/* 브랜드 탭(bar형태) */}
            <BrandTab/>
            {/* 페이지 별 내용 */}
            <Box sx={{flexGrow: "1"}}>
                {children}
            </Box>
            {/* 하단 레이아웃 */}
            <Box sx={{
                position: "relative",
                transform: "translateY(0%)"
            }}>
                <Footer/>
            </Box>
        </Box>
        </body>
        </html>
        )
        }