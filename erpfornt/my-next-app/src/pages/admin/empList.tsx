'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getEmployeeListByEX, modifyEmployee, deleteEmployee } from "@/api/api";
import { EmployeeDto } from "@/api/datatype";
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

// 프론트엔드에서 사용할 Role 값 정의
const roleOptions = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'PURCHASING', label: 'Purchasing' },
    { value: 'FINANCE', label: 'Finance' },
    { value: 'HUMAN_RESOURCE', label: 'Human Resource' },
    { value: 'CUSTOMER_SERVICE', label: 'Customer Service' },
];

const EmployeeAdminPage = () => {
    const [employees, setEmployees] = React.useState<EmployeeDto[]>([]); // 직원 데이터 상태
    const [loading, setLoading] = React.useState<boolean>(false); // 로딩 상태
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // 에러 메시지 상태

    // 데이터 그리드 컬럼 정의
    const columns: GridColDef<EmployeeDto>[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'gender', headerName: 'Gender', width: 100 },
        { field: 'address', headerName: 'Address', width: 250 },
        { field: 'birthDate', headerName: 'Birth Date', width: 150 },
        { field: 'phoneNumber', headerName: 'Phone', width: 150 },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'position', headerName: 'Position', width: 150 },
        { field: 'salary', headerName: 'Salary', width: 120, type: 'number' },
        { field: 'incentive', headerName: 'Incentive', width: 120, type: 'number' },
        { field: 'hireDate', headerName: 'Hire Date', width: 150 },
        { field: 'resignationDate', headerName: 'Resignation Date', width: 150 },
        { field: 'annualLeave', headerName: 'Annual Leave', width: 120, type: 'number' },
        { field: 'rating', headerName: 'Rating', width: 120, type: 'number' },
        {
            field: 'role',
            headerName: 'Role',
            width: 150,
            editable: true,
            renderEditCell: (params) => renderEditRoleCell(params)
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleModify(params.row)}
                    >
                        Modify
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        //@ts-ignore
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    // 초기 데이터 로드
    React.useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const fetchedEmployees = await getEmployeeListByEX();
                setEmployees(fetchedEmployees);
            } catch (err: any) {
                setErrorMessage(err.message || 'Failed to fetch employees.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    // 직원 수정 핸들러
    const handleModify = async (employee: EmployeeDto) => {
        try {
            const updatedEmployee = await modifyEmployee(employee.id!, employee);
            setEmployees((prev) =>
                prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
            );
            alert(`Employee ${employee.name} updated successfully.`);
        } catch (err: any) {
            alert(`Failed to update employee: ${err.message}`);
        }
    };

    // 직원 삭제 핸들러
    const handleDelete = async (employeeId: number) => {
        if (!window.confirm(`Are you sure you want to delete employee ${employeeId}?`)) {
            return;
        }
        try {
            await deleteEmployee(employeeId);
            setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
            alert(`Employee ${employeeId} deleted successfully.`);
        } catch (err: any) {
            alert(`Failed to delete employee: ${err.message}`);
        }
    };

    // 롤 수정 셀 렌더링
    const renderEditRoleCell = (params: GridRenderEditCellParams) => {
        return (
            <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                    value={params.value || ''}
                    onChange={(event) => {
                        params.api.setEditCellValue(event.target.value);
                    }}
                >
                    {roleOptions.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                            {role.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    };

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

export default EmployeeAdminPage;
