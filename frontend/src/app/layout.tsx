
import { Box } from "@mui/material";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import "@/styles/globals.css";
import Loading from "@/app/loading";
import BrandTab from "@/components/layout/BrandTab";
const cookie = require("cookie");



type LayoutChildren = {
    children: ReactNode;
};

export default function RootLayout({ children }: LayoutChildren) {



    return (
        <html lang="kr">
        <head>
            <title>ToolBox</title>
        </head>
        <body>
        <Box
            sx={{
                minHeight: "100vh", // 최소 화면 높이가 브라우저 100%
                display: "flex", // 브라우저 컨텐츠 관리용
                flexDirection: "column", // 세로 방향으로 배치
                overflow: "auto", // 스크롤 가능
                position: "relative",
            }}
        >
            {/* 상단 검색창, 로그인 등 */}
            <Header />
            {/* 카테고리 바 */}
            <Navbar />
            {/* 브랜드 탭(bar형태) */}
            <BrandTab />
            {/* 페이지 별 내용 */}
            <Box sx={{ flexGrow: 1 }}>{children}</Box>
            {/* 하단 레이아웃 */}
            <Box
                sx={{
                    position: "relative",
                    transform: "translateY(0%)",
                }}
            >
                <Footer />
            </Box>
        </Box>
        </body>
        </html>
    );
}
