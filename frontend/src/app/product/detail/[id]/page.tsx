
"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import {Box} from "@mui/material";
import ProductDetail from "@/components/product/ProductDetail";

export default function  detailPage ({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;

    return (
        <Box>
            <ProductDetail productId={id}/>
        </Box>
    );
};
