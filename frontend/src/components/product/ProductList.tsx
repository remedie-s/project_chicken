
"use client"
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Grid2, Stack} from "@mui/material";
import {ProductsDto} from "@/types/productType";


export default function ProductList( products:ProductsDto[]) {
    return (
        <Box>
            <DataGrid
                columns={[{ field: 'name' }]}
                rows={products}
            />
        </Box>
    );
}
