import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import axios from "axios";
import {NoticeDto} from "@/types/noticeType";

const NoticeModal = () => {
    const [open, setOpen] = useState(false);
    const [noticeDetail, setNoticeDetail] = useState<NoticeDto>();

    useEffect(() => {
        const hideNotice = localStorage.getItem('hideNotice');
        if (!hideNotice) {
            const fetchData = async () => {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
                const res = await axios.get<NoticeDto>(`${apiUrl}/notice/newest`);
                if (res.data===null){return false;}
                setNoticeDetail(res.data);
                return true;
            }
            if(!fetchData()) {return;}
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleHideForDay = () => {
        const now = new Date();
        const expiration = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        localStorage.setItem('hideNotice', expiration.toISOString());
        setOpen(false);
    };


    if(!noticeDetail) {return null;}

    return (
        <Modal open={open}
               onClose={handleClose}
               BackdropProps={{ style: { backgroundColor: "transparent"} }}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 4,
                padding: 4,
            }}>
                <Typography variant="h5">
                    최근 공지사항
                </Typography>
                {noticeDetail.imageUrl?
                    (<Box
                        // 이미지 크기 조절
                        sx={{
                            width: "100%",
                            height: "400px", // 원하는 높이로 설정
                            backgroundImage: `url(${noticeDetail.imageUrl})`,
                            backgroundSize: "cover", // 이미지가 전체 박스를 덮도록 설정
                            backgroundPosition: "center", // 이미지의 중앙을 기준으로 설정
                            display: "flex", // Flexbox 사용
                            justifyContent: "space-between", // 좌우로 배치
                            alignItems: "center", // 세로로 가운데 정렬
                            maxWidth: "800px"
                        }}
                    ></Box>)
                    :
                    (<></>)
                }
                <Typography sx={{ mt: 2,
                    borderBottom: '1px solid #ccc' }} variant="h6">
                    {noticeDetail.title}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {noticeDetail.content}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleHideForDay} variant="contained">하루 동안 안 보기</Button>
                    <Button onClick={handleClose} variant="outlined">닫기</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default NoticeModal;
