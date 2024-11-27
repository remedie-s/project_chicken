
"use client"
import {Box} from "@mui/material";
import {useEffect, useState} from "react";
import {ProductsDto} from "@/types/productType";
import * as React from "react";
import LoadingScreen from "@/components/LoadingScreen"

export default function page() {

    const [products, setProducts] = useState<ProductsDto|null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [products]);

    if(loading){
        return <LoadingScreen/>
    }

    return (
        <Box>

        </Box>)
}