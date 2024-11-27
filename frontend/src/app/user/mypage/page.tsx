"use client"

import authPage from "@/scripts/auth/authPage";
import {useEffect} from "react";

export default function mypage() {

    useEffect(()=>{
        authPage();
    },[])
    return (
        <>
            마이페이지입니다
        </>
    )
}