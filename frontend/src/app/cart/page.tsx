
"use client"
import {useEffect, useState} from "react";
import authPage from "@/scripts/auth/authPage";
import {useRouter} from "next/navigation";
import CartsList from "@/components/carts/CartsList";
import {Box} from "@mui/material";


export default function page(){
    return (
        <Box>
            <CartsList/>
        </Box>
    );
}