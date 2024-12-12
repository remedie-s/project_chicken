import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getUserList, modifyUser, deleteUser } from "@/api/api"; // API 호출 변경
import { UsersDto } from "@/api/datatype"; // UsersDto 사용
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';



const UserAdminPage = () => {
    const [users, setUsers] = React.useState<UsersDto[]>([]); // 유저 데이터 상태
    const [loading, setLoading] = React.useState<boolean>(false); // 로딩 상태
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // 에러 메시지 상태

    // 데이터 그리드 컬럼 정의
    const columns: GridColDef<UsersDto>[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'gender', headerName: 'Gender', width: 100 },
        { field: 'address', headerName: 'Address', width: 250 },
        { field: 'birthDate', headerName: 'Birth Date', width: 150 },
        { field: 'userGrade', headerName: 'User Grade', width: 120 },
        { field: 'totalPurchaseCount', headerName: 'Total Purchase Count', width: 180 },
        { field: 'totalPurchasePrice', headerName: 'Total Purchase Price', width: 180 },

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
        const fetchUsers = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const fetchedUsers = await getUserList(); // API 호출 변경
                setUsers(fetchedUsers);
            } catch (err: any) {
                setErrorMessage(err.message || 'Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 유저 수정 핸들러
    const handleModify = async (user: UsersDto) => {
        try {
            const updatedUser = await modifyUser(user); // API 호출 변경
            setUsers((prev) =>
                prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
            alert(`User ${user.name} updated successfully.`);
        } catch (err: any) {
            alert(`Failed to update user: ${err.message}`);
        }
    };

    // 유저 삭제 핸들러
    const handleDelete = async (userId: number) => {
        if (!window.confirm(`Are you sure you want to delete user ${userId}?`)) {
            return;
        }
        try {
            await deleteUser(userId); // API 호출 변경
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            alert(`User ${userId} deleted successfully.`);
        } catch (err: any) {
            alert(`Failed to delete user: ${err.message}`);
        }
    };


    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                User List
            </Typography>

            {/* 에러 메시지 */}
            {errorMessage && (
                <Typography color="error" variant="h6" align="center" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            {/* 데이터 그리드 */}
            {users.length > 0 ? (
                <DataGrid
                    rows={users}
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
                    No users found.
                </Typography>
            )}
        </Box>
    );
};

export default UserAdminPage;
