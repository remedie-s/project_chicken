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

    return (
        <>
            <AppBar position="static" sx={{ height: 60, width: "100%", backgroundColor: '#000000', display: "flex"}}>
                <Toolbar sx={{height: 60, backgroundColor: '#000000', padding: 0, margin: 0, alignItems: 'center' }}>
                    <Box
                        id="categoryMenu"
                        sx={{height: 60, backgroundColor: "#FFDF00", color: "#000000", display: 'flex', alignItems: 'center',
                            justifyContent: 'center'}}
                        onClick={menuOpen}>
                        <MenuIcon/>
                        전체 카테고리
                    </Box>
                    <Button color="inherit" onClick={() => router.push("/")}>홈</Button>
                    <Button color="inherit" onClick={() => router.push("/product/new")}>신상품</Button>
                    <Button color="inherit" onClick={() => router.push("/product/event")}>이벤트 상품</Button>
                    <Button color="inherit" onClick={() => router.push("/notice")}>공지사항</Button>
                    <Button color="inherit" onClick={() => router.push("/service")}>고객센터</Button>
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
                <MenuItem onClick={() => selectCategory("wood")}>목공공구</MenuItem>
                <MenuItem onClick={() => selectCategory("")}>설비공구</MenuItem>
                <MenuItem onClick={() => selectCategory("")}>원예공구</MenuItem>
                <MenuItem onClick={() => selectCategory("")}>전동공구</MenuItem>
                <MenuItem onClick={() => selectCategory("hand")}>수작업공구</MenuItem>
                <MenuItem onClick={() => selectCategory("")}>측정공구</MenuItem>
                <MenuItem onClick={() => selectCategory("elec")}>전기용품</MenuItem>
                <MenuItem onClick={() => selectCategory("safe")}>안전용품</MenuItem>
            </Menu>
        </>)
}