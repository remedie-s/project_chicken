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
import {usePathname, useRouter} from "next/navigation";

// 현재는 의미 없어서 라우팅 처리
export default function myPage() {
    const router = useRouter();

    useEffect(() => {
        // /mypage 경로에 접근하면 /mypage/order로 리디렉션
        router.replace('/user/mypage/order');
    }, [router]);

    return null;
}