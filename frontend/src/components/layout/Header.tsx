// 사이트 로고, 검색창

'use client'
import {
    AppBar,
    Box,
    Button,
    IconButton,
    TextField,
    Toolbar,
    Typography,
    Container
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import {useState, useRef} from "react";
import {useRouter} from "next/navigation";


export default function Header(){
    const [searchText,setSearchText] = useState("");
    const router = useRouter();
    const keyword = useRef("");


    const search = async () => {
        await axios.post("http://localhost:8080/api/product/search", searchText)
    }
    const goHome = () =>{
        router.push("/")
    }

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
                <Box
                    component="img" src="/ToolBox_Logo.png"
                    sx={{ height: "70px", width: "auto", objectFit: "contain", marginRight: 2, }}
                    onClick={goHome}/>
                <TextField variant="outlined" size="small" placeholder="상품 검색" sx={{ flexGrow: 1, marginRight: 2 }} />
                <Button
                    sx={{ backgroundColor: "#FFDF00", color: "#000000", marginRight: 1 }}
                onClick={()=>{router.push("/user/login")}}>로그인</Button>
                <Button
                    sx={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                    onClick={()=>{router.push("/user/register")}}>회원가입</Button>
            </Box>
        </Box>
    );
}