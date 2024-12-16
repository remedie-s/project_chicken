import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import axios from "axios";
import {NoticeDto} from "@/types/noticeType";

const NoticeModal = () => {
    const [open, setOpen] = useState(false);
    const [noticeDetal, setNoticeDetail] = useState<NoticeDto>();

    useEffect(() => {
        const hideNotice = localStorage.getItem('hideNotice');
        if (!hideNotice) {
            const fetchData = async () => {
                const res = await axios.get<NoticeDto>("http://localhost:8080/api/notice/newest");
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

    return (
        <Modal open={open} onClose={handleClose}>
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
                <Typography sx={{ mt: 2 }} variant="h6">
                    {noticeDetal?.title}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {noticeDetal?.content}
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
