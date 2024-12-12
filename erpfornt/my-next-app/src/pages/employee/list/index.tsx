'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getEmployeeList, modifyEmployee, deleteEmployee } from "@/api/api";
import { EmployeeDto } from "@/api/datatype";
/**
 * 인원 목록 보기 페이지
 * export type EmployeeDto = {
 *     id?: number|null;
 *     name: string;
 *     email: string;
 *     phoneNumber: string;
 *     department: string;
 *     position: string;
 *     hireDate: string; // LocalDateTime은 string으로 처리
 *     resignationDate: string | null; // LocalDateTime은 string으로 처리, 퇴사일은 null 가능

 *
 * }
 * @constructor
 */



const EmployeePage = () => {
    const [employees, setEmployees] = React.useState<EmployeeDto[]>([]); // 직원 데이터 상태
    const [loading, setLoading] = React.useState<boolean>(false); // 로딩 상태
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // 에러 메시지 상태

    // 데이터 그리드 컬럼 정의
    const columns: GridColDef<EmployeeDto>[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phoneNumber', headerName: 'Phone', width: 150 },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'position', headerName: 'Position', width: 150 },
        { field: 'hireDate', headerName: 'Hire Date', width: 150 },
    ];1

    // 초기 데이터 로드
    React.useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const fetchedEmployees = await getEmployeeList();
                setEmployees(fetchedEmployees);
            } catch (err: any) {
                setErrorMessage(err.message || 'Failed to fetch employees.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);


    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Employee List
            </Typography>

            {/* 에러 메시지 */}
            {errorMessage && (
                <Typography color="error" variant="h6" align="center" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            {/* 데이터 그리드 */}
            {employees.length > 0 ? (
                <DataGrid
                    rows={employees}
                    columns={columns}
                    getRowId={(row) => row.id || Math.random()}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            ) : loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Typography variant="h6" align="center">
                    No employees found.
                </Typography>
            )}
        </Box>
    );
};


export default EmployeePage;
