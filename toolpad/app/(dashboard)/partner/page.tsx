'use client';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import {getAllPartners} from "@/app/api/api";
import {Partner} from "@/app/types/datatype";

/**
 * 파트너 관리 페이지
 * @constructor
 *     id: number;
 *     name: string;
 *     email: string;
 *     managerName: string;
 *     phone: string;
 *     address: string;
 *     website: string;
 *     description: string;
 *     outstanding: number;
 *     contactStart: string;
 *     contactEnd: string;
 */






// DataGrid Columns 정의
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'managerName', headerName: 'Manager', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'website', headerName: 'Website', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'outstanding', headerName: 'Outstanding', width: 120, type: 'number' },
    { field: 'contactStart', headerName: 'Start Date', width: 150 },
    { field: 'contactEnd', headerName: 'End Date', width: 150 },
];

export default function PartnerPage(): JSX.Element {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 파트너 데이터 가져오기
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const data = await getAllPartners();
                setPartners(data);
            } catch (error) {
                console.error('Error fetching partners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={partners.map((partner) => ({
                    ...partner,
                    id: partner.id || Math.random(), // id가 없는 경우 임시 ID 할당
                }))}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}
