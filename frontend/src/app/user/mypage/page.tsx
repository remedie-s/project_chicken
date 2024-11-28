"use client"

import authPage from "@/scripts/auth/authPage";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import MypageSide from "@/components/user/MypageSide";
import MypageOrder from "@/components/user/MypageOrder";
import MypageProfile from "@/components/user/MypageProfile";
import MypageQuestion from "@/components/user/MypageQuestion";
import axios from "axios";
import authApi from "@/scripts/auth/authApi"
import type {OrderDto} from "@/types/orderType"

export default function mypage() {
    const [mypageContent, setMypageContent] = useState(1);
    const [userOrders, setUserOrders] = useState<OrderDto[]|null>(null);

    useEffect(() => {
        authPage();
        const fetchData = async () => {
            try {
                const res = await authApi.get<OrderDto[]|null>("/orders/list");
                setUserOrders(res.data);
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchData();
    }, []);

    const renderContent = () => {
        switch (mypageContent) {
            case 1:
                return <MypageOrder orders={userOrders}/>;
            case 2:
                return <MypageProfile/>;
            case 3:
                return <MypageQuestion/>;
            default:
                return <MypageOrder orders={userOrders}/>;
        }
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', flexGrow: 1}}>
            <MypageSide setMypageContent={setMypageContent}/>
            <Box sx={{margin: 3}}>
            {renderContent()}
            </Box>
        </Box>
    )
}