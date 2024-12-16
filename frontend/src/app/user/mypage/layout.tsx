"use client"

import useAuth from "@/scripts/auth/useAuth";
import {ReactNode, useEffect, useState} from "react";
import {Box} from "@mui/material";
import MypageSide from "@/components/user/MypageSide";
import MypageOrder from "@/components/user/MypageOrder";
import MypageProfile from "@/components/user/MypageProfile";
import MypageQuestion from "@/components/user/MypageQuestion";
import axios from "axios";
import authApi from "@/scripts/auth/authApi"
import type {OrderDto} from "@/types/orderType"
import {usePathname, useRouter} from "next/navigation";
import LoadingScreen from "@/components/layout/LoadingScreen";

type LayoutChildren = {
    children: ReactNode;
};
export default function mypage({children}: LayoutChildren) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/user/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return <LoadingScreen/>;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
            <MypageSide />
            <Box sx={{ margin: 3, flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    )
}