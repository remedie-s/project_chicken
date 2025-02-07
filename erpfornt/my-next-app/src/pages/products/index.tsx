'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { useRouter } from 'next/router'; // Next.js 라우터 사용
import { productData } from "@/api/datatype";
import { productList } from "@/api/api";

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

export default function Index(): JSX.Element {
    const [rows, setRows] = React.useState<productData[]>([]);
    const router = useRouter(); // Next.js 라우터

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

    // 행 클릭 핸들러
    const handleRowClick: GridEventListener<'rowClick'> = (params) => {
        const { id } = params.row; // 클릭한 행의 ID 가져오기
        if (id) {
            router.push(`/products/detail/${id}`); // 상세 페이지로 이동
        }
    };

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
                onRowClick={handleRowClick} // 행 클릭 이벤트 연결
            />
        </Box>
    );
}
