import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router'; // Next.js 라우터 사용
import {noticeList, noticeModify, noticeDelete, noticeAdminList} from "@/api/api"; // API 호출
import { noticeData } from "@/api/datatype"; // 타입 정의

const NoticeAdminPage = () => {
    const [notices, setNotices] = React.useState<noticeData[]>([]); // 공지사항 상태
    const [loading, setLoading] = React.useState<boolean>(false); // 로딩 상태
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // 에러 메시지 상태
    const router = useRouter();

    // 데이터 그리드 컬럼 정의
    const columns: GridColDef<noticeData>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            //@ts-ignore
            renderCell: (params: GridRenderCellParams<number>) => (
                <Button
                    variant="text"
                    onClick={() => router.push(`/notice/detail?id=${params.value}`)}
                    sx={{ textTransform: 'none', color: 'primary.main' }}
                >
                    {params.value}
                </Button>
            ),
        },
        { field: 'title', headerName: 'Title', width: 200, editable: true },
        { field: 'content', headerName: 'Content', width: 150, editable: true },
        {
            field: 'type',
            headerName: 'Type',
            width: 120,
            editable: true,
            //@ts-ignore
            renderCell: (params: GridRenderCellParams<number>) => {
                // 타입 값에 따라 텍스트 변환
                const typeMapping = {
                    0: 'Shopping Mall',
                    1: 'ERP',
                    2: 'Common',
                };
                //@ts-ignore
                return <Typography>{typeMapping[params.value] || 'Unknown'}</Typography>;
            },
        },
        { field: 'createTime', headerName: 'Create Time', width: 200 },
        { field: 'updateTime', headerName: 'Update Time', width: 200 },
        { field: 'imageUrl', headerName: '이미지 URL',width:200 },
        { field: 'deleteTime', headerName: 'Expire Time', width: 200 },
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
                        onClick={() => handleDelete(params.row.id!)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    // 공지사항 목록 가져오기
    React.useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const fetchedNotices = await noticeAdminList();
                const sortedNotices = fetchedNotices.sort(
                    (a: noticeData, b: noticeData) =>
                        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
                );
                setNotices(sortedNotices);
            } catch (err: any) {
                setErrorMessage(err.message || 'Failed to fetch notices.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    // 공지사항 수정 핸들러
    const handleModify = async (notice: noticeData) => {
        try {
            const updatedNotice = await noticeModify(notice);
            setNotices((prev) =>
                prev.map((n) => (n.id === updatedNotice.id ? updatedNotice : n))
            );
            alert(`Notice "${notice.title}" updated successfully.`);
        } catch (err: any) {
            alert(`Failed to update notice: ${err.message}`);
        }
    };

    // 공지사항 삭제 핸들러
    const handleDelete = async (noticeId: number) => {
        if (!window.confirm(`Are you sure you want to delete notice ${noticeId}?`)) {
            return;
        }
        try {
            await noticeDelete(noticeId);
            setNotices((prev) => prev.filter((n) => n.id !== noticeId));
            alert(`Notice ${noticeId} deleted successfully.`);
        } catch (err: any) {
            alert(`Failed to delete notice: ${err.message}`);
        }
    };

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Notice List
            </Typography>

            {/* 에러 메시지 */}
            {errorMessage && (
                <Typography color="error" variant="h6" align="center" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            {/* 데이터 그리드 */}
            {notices.length > 0 ? (
                <DataGrid
                    rows={notices}
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
                    No notices found.
                </Typography>
            )}
        </Box>
    );
};

export default NoticeAdminPage;
