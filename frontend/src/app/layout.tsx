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
        <html lang="ko">
        <head></head>
        <body>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Box sx={{ flex: "1" }}>
                {/* 상단 검색창, 로그인 등 */}
                <Header userName={userName} />
                {/* 카테고리 바 */}
                <Navbar />
                {/* 페이지 별 내용 */}
                {children}
            </Box>
            {/* 하단 레이아웃 */}
            <Box sx={{ flexShrink: 0 }}>
            <Footer />
            </Box>
        </Box>
        </body>
        </html>
    )
}