// 사이트 카테고리바
"use client";

import {AppBar, Button, Toolbar, Menu, MenuItem, Box} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import React, {useState, MouseEvent} from "react";
import {useRouter} from "next/navigation";



export default function Navbar() {
    const [anchorCategory, setAnchorCategory] = useState<null|HTMLElement>(null) ;
    const router = useRouter();

    const menuOpen = (e:MouseEvent<HTMLElement>) => {
        setAnchorCategory(e.currentTarget as HTMLElement);
    };

    const menuClose = () => {
        setAnchorCategory(null);
    };
    const selectCategory = (selCategory:string) => {
        router.push(`/category/${selCategory}`)
        menuClose();
    };

    const categoryItem = (name:string) => {
        return (
            <MenuItem onClick={() => selectCategory(name)}>
                {name}
            </MenuItem>
        )
    }
    const barMenu = ({name, url}:{name:string, url:string}) => {
        const [bgColor, setBgColor] = useState("#000000");
        const router = useRouter();

        const handleMouseOver = () => {
            setBgColor("#707070");
        };

        const handleMouseOut = () => {
            setBgColor("#000000");
        };


        const handleClick = () => {
            if (url === "/") {
                // 홈일 경우 goHome 호출
                window.location.href = "/";
            } else {
                // 그 외 URL일 경우 router.push 사용
                router.push(url);
            }
        };

        return (
            <Box sx={{
                color: "#FFFFFF",
                width: "10%",
                height: "100%",
                // Box 사이에 얇은 선 추가
                borderRight: '1px solid #ccc',
                bgcolor: bgColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
                 onClick={handleClick}
                 onMouseOver={handleMouseOver}
                 onMouseOut={handleMouseOut}
            >
                {name}
            </Box>
        )
    }

    const goHome = () => {
        window.location.href="/"
    };

    return (
        <>
            <AppBar
                position="relative" sx={{ height: 60, width: "100%", backgroundColor: '#000000', zIndex: 1000}}>
                <Toolbar sx={{height: 60, backgroundColor: '#000000', padding: 0, margin: 0, alignItems: 'center', display: "flex" }}>
                    <Box
                        id="categoryMenu"
                        sx={{height: "100%", backgroundColor: "#FFDF00", color: "#000000", display: 'flex', alignItems: 'center',
                            justifyContent: 'center', width: "10%"}}
                        onClick={menuOpen}>
                        <MenuIcon/>
                        카테고리
                    </Box>
                    {barMenu ({name:"홈", url:"/"})}
                    {barMenu ({name:"신상품", url:"/product/new"})}
                    {barMenu ({name:"이벤트 상품", url:"/product/event"})}
                    {barMenu ({name:"공지사항", url:"/notice"})}
                    {barMenu ({name:"고객센터", url:"/service"})}
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorCategory}
                open={Boolean(anchorCategory)}
                onClose={menuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{ mt: 1 }}
            >
                {categoryItem("목공공구")}
                {categoryItem("용접공구")}
                {categoryItem("원예공구")}
                {categoryItem("수작업공구")}
                {categoryItem("전동공구")}
                {categoryItem("측정공구")}
                {categoryItem("안전용품")}
                {categoryItem("전기용품")}
                {categoryItem("페인트용품")}
                {categoryItem("공구세트")}
            </Menu>
        </>)
}