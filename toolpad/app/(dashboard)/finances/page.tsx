'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'discount', headerName: 'Discount', width: 150 },
    { field: 'payPrice', headerName: 'Pay Price', width: 150 },
    { field: 'cost', headerName: 'Cost', width: 150 },
];

const FinancePage = (): JSX.Element => {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 데이터 가져오기
    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const response = await axios.get('/fiance/all'); // API 호출
                const data = response.data;

                // 데이터를 DataGrid 형식으로 변환
                const formattedData = [
                    {
                        id: 1,
                        price: data.price,
                        discount: data.discount,
                        payPrice: data.payPrice,
                        cost: data.cost,
                    },
                ];

                setRows(formattedData);
            } catch (error) {
                console.error('Failed to fetch finance data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, []);

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
};

export default FinancePage;
