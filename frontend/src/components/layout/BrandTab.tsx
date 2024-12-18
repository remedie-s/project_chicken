"use client"
import {AppBar, Box, Toolbar} from "@mui/material";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function BrandTab() {
    const router = useRouter();

    const brandBox = (name:string) => {
        const [bgColor, setBgColor] = useState("transparent");
        const router = useRouter();

        const handleMouseOver = () => {
            setBgColor("#e0e0e0");
        };

        const handleMouseOut = () => {
            setBgColor("transparent");
        };
        return (
            <Box sx={{
                color: "#000000",
                width: "10%",
                height: "100%",
                // Box 사이에 얇은 선 추가
                borderLeft: '1px solid #ccc',
                borderRight: '1px solid #ccc',
                bgcolor: bgColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
            onClick={() => router.push(`/brand/${name}`)}
                 onMouseOver={handleMouseOver}
                 onMouseOut={handleMouseOut}
            >
                {name}
            </Box>
        )
    }

    return (
            <AppBar
                position="relative"
                sx={{
                    // 그라데이션 색상 설정
                    background: "linear-gradient(to top, #e0e0e0, #ffffff)",
                    zIndex: 900
            }}>
                <Toolbar sx={{
                    display: "flex",
                    height: 60,
                    backgroundColor: "transparent", // 투명 배경
                    padding: 0,
                    margin: 0,
                    alignItems: "center"}}>
                    {brandBox("Bosch")}
                    {brandBox("DeWalt")}
                    {brandBox("ES산업")}
                    {brandBox("계양")}
                    {brandBox("Milwaukee")}
                    {brandBox("Makita")}
                    {brandBox("LS전선")}
                    {brandBox("Hitachi")}
                    {brandBox("Stanley")}
                    {brandBox("기타")}
                </Toolbar>
            </AppBar>)
}