'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import {productData} from "@/app/types/datatype";
import {productList} from "@/app/api/api";

/**
 *     id?: number|null;
 *     name: string;
 *     description: string;
 *     price: number;
 *     createdAt: string; // LocalDateTime은 ISO 8601 형식의 문자열로 변환할 수 있습니다.
 *     imageUrl: string;
 *     stock: number;
 *     sellCount: number;
 *     category: string;
 *     mainItemNumber: number;
 *     event: number;
 *     brand: string;
 *     cost: number;
 *     partnerId: number; // Partner는 별도의 타입으로 정의해야 합니다.
 *
 *
 * @constructor
 */



// 컬럼 정의
const columns: GridColDef<productData>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'price', headerName: 'Price', type: 'number', width: 100 },
    { field: 'stock', headerName: 'Stock', type: 'number', width: 100 },
    { field: 'sellCount', headerName: 'Sell Count', type: 'number', width: 100 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'brand', headerName: 'Brand', width: 150 },
];

export default function ProductPage(): JSX.Element {
    const [rows, setRows] = React.useState<productData[]>([]);

    // 데이터 가져오기
    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productList(); // 분리된 API 호출
                setRows(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id || Math.random()} // ID가 없는 경우 fallback 처리
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}