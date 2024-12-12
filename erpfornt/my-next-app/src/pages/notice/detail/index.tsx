import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { noticeData } from "@/api/datatype";
import { noticeDetail } from "@/api/api"; // API 함수 가져오기

const NoticeDetailPage = (): JSX.Element => {
    const [inputId, setInputId] = useState<string>(""); // 사용자 입력 ID 상태
    const [notice, setNotice] = useState<noticeData | null>(null); // 공지사항 데이터 상태
    const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태
    const router = useRouter();

    // 쿼리에서 ID를 읽어 자동 검색
    useEffect(() => {
        const queryId = router.query.id as string | undefined;
        if (queryId) {
            setInputId(queryId);
            handleSearch(queryId);
        }
    }, [router.query.id]);

    // 공지사항 검색
    const handleSearch = async (idToSearch: string = inputId) => {
        const parsedId = Number(idToSearch);

        if (isNaN(parsedId) || parsedId <= 0) {
            setError("Please enter a valid numeric Notice ID.");
            return;
        }

        setLoading(true);
        setError(null);
        setNotice(null);

        try {
            const fetchedNotice = await noticeDetail(parsedId); // Long 타입으로 변환된 ID 사용
            setNotice(fetchedNotice);
        } catch (err: any) {
            setError(err.message || "Failed to fetch notice details.");
        } finally {
            setLoading(false);
        }
    };

    // 홈으로 이동
    const handleGoHome = () => {
        router.push("/");
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* 입력 필드와 버튼 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <TextField
                    label="Notice ID"
                    variant="outlined"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" onClick={() => handleSearch()} disabled={loading}>
                    Search
                </Button>
            </Box>

            {/* 로딩 중 표시 */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* 에러 메시지 표시 */}
            {error && (
                <Typography color="error" variant="h6" align="center" sx={{ mt: 3 }}>
                    {error}
                </Typography>
            )}

            {/* 공지사항 정보 표시 */}
            {notice && (
                <Box>
                    <Typography variant="h4" gutterBottom>
                        {notice.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {notice.content}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Created At: {notice.createTime}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Updated At: {notice.updateTime}
                    </Typography>

                    {notice.imageUrl && (
                        <Box
                            component="img"
                            src={notice.imageUrl}
                            alt={notice.title}
                            sx={{ width: "100%", maxHeight: 300, mt: 2 }}
                        />
                    )}
                </Box>
            )}

            {/* 홈으로 가기 버튼 */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button variant="contained" color="secondary" onClick={handleGoHome}>
                    Go to Home
                </Button>
            </Box>
        </Box>
    );
};

export default NoticeDetailPage;
