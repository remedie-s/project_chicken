'use client';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getAllPartners, updatePartner, deletePartner } from '@/api/api';
import { Partner, PartnerDto } from '@/api/datatype';

// DataGrid Columns 정의
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'email', headerName: 'Email', width: 100 , editable: true},
    { field: 'managerName', headerName: 'Manager', width: 100, editable: true },
    { field: 'phone', headerName: 'Phone', width: 100, editable: true },
    { field: 'address', headerName: 'Address', width: 100 , editable: true},
    { field: 'website', headerName: 'Website', width: 100, editable: true },
    { field: 'description', headerName: 'Description', width: 150 , editable: true},
    { field: 'outstanding', headerName: 'Outstanding', width: 120, type: 'number' , editable: true},
    { field: 'contactStart', headerName: 'Start Date', width: 150 , editable: true},
    { field: 'contactEnd', headerName: 'End Date', width: 150, editable: true },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        renderCell: (params) => (
            <>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => params.row.handleEdit(params.row)}
                    sx={{ mr: 1 }}
                >
                    Edit
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => params.row.handleDelete(params.row.id)}
                >
                    Delete
                </Button>
            </>
        ),
    },
];

export default function PartnerIndex(): JSX.Element {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedPartner, setSelectedPartner] = useState<PartnerDto | null>(null);

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

    // 수정 다이얼로그 열기
    const handleEdit = (partner: Partner) => {
        setSelectedPartner(partner);
        setOpen(true);
    };

    // 수정 저장
    const handleSave = async () => {
        if (selectedPartner && selectedPartner.id) {
            try {
                const updatedPartner = await updatePartner(selectedPartner.id, selectedPartner);
                setPartners((prev) =>
                    prev.map((p) => (p.id === updatedPartner.id ? updatedPartner : p))
                );
                setOpen(false);
            } catch (error) {
                console.error('Error updating partner:', error);
            }
        }
    };

    // 삭제 처리
    const handleDelete = async (id: number) => {
        try {
            await deletePartner(id);
            setPartners((prev) => prev.filter((partner) => partner.id !== id));
        } catch (error) {
            console.error('Error deleting partner:', error);
        }
    };

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={partners.map((partner) => ({
                    ...partner,
                    id: partner.id || Math.random(), // id가 없는 경우 임시 ID 할당
                    handleEdit: handleEdit,
                    handleDelete: handleDelete,
                }))}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
                checkboxSelection
                disableRowSelectionOnClick
            />

            {/* 수정 다이얼로그 */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>Edit Partner</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={selectedPartner?.name || ''}
                        onChange={(e) => setSelectedPartner({ ...selectedPartner!, name: e.target.value })} // selectedPartner가 항상 존재한다고 가정
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Email"
                        value={selectedPartner?.email || ''}
                        onChange={(e) => setSelectedPartner({ ...selectedPartner!, email: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Manager Name"
                        value={selectedPartner?.managerName || ''}
                        onChange={(e) => setSelectedPartner({ ...selectedPartner!, managerName: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    {/* 추가 필드들 */}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            setSelectedPartner(null); // 선택 초기화
                        }}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
