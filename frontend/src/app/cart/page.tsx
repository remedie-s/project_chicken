
"use client"
import {useEffect, useState} from "react";
import useAuth from "@/scripts/auth/useAuth";
import {useRouter} from "next/navigation";
import CartsList from "@/components/carts/CartsList";
import {Box} from "@mui/material";
import Loading from "@/app/loading";
import CenterBox from "@/components/layout/CenterBox";


export default function page(){
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            console.log("레이아웃측에서 user 정보 못 받음");
            router.push("/user/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return <Loading/>;
    }

    return (
        <CenterBox>
            <CartsList/>
        </CenterBox>
    );
}