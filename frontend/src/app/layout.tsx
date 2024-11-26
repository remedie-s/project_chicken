import {Box} from "@mui/material";
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import {Children} from "react";
import React, { ReactNode } from 'react'
import Navbar from "@/components/layout/Navbar";
import '@/styles/globals.css';

type layoutChildren = {
    children: ReactNode
}

export default function layout({children}:layoutChildren) {
    return (
        <html lang="ko">
        <head></head>
        <body>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* 상단 검색창, 로그인 등 */}
        <Header/>
        {/* 카테고리 바 */}
        <Navbar/>
        {/* 페이지 별 내용 */}
            <Box sx={{ flex: 1}}>
        {children}
            </Box>
        {/* 하단 레이아웃 */}
        <Footer/>
        </Box>
        </body>
        </html>
    )
}