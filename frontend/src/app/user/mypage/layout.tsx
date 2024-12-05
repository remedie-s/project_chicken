"use client"

import authPage from "@/scripts/auth/authPage";
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

type LayoutChildren = {
    children: ReactNode;
};
export default function mypage({children}: LayoutChildren) {


    return (
        <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
            <MypageSide />
            <Box sx={{ margin: 3, flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    )
}