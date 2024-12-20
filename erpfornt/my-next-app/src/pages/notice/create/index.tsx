'use client';

import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, MenuItem } from '@mui/material';
import { noticeCreate } from '@/api/api';
import { noticeData } from '@/api/datatype';
import { useRouter } from 'next/navigation';

/**
 * 공지사항 생성 페이지
 * 입력창: 제목, 내용, 이미지 URL, 타입, 생성 시간, 수정 시간
 * 버튼: 초기화 버튼, 생성 버튼, 메인 페이지로 돌아가기 버튼
 */
export default function NoticeCreatePage(): JSX.Element {
    const [formData, setFormData] = useState<noticeData>({
        id: null,
        title: '',
        content: '',
        imageUrl: '',
        type: '0',
        createTime: '',
        updateTime: '',
        deleteTime: '',
    });

    const router = useRouter();

    // 입력 필드 변경 핸들러
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async () => {
        try {
            await noticeCreate(formData);
            alert('공지사항이 성공적으로 생성되었습니다. 3초 후 메인 페이지로 이동합니다.');
            handleReset();
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error: any) {
            alert(`공지사항 생성 실패: ${error}`);
        }
    };

    // 초기화 핸들러
    const handleReset = () => {
        setFormData({
            id: null,
            title: '',
            content: '',
            imageUrl: '',
            type: '0',
            createTime: '',
            updateTime: '',
            deleteTime: '',
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                공지사항 생성
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="제목"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="내용"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="이미지 URL"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        label="타입"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="0">쇼핑몰</MenuItem>
                        <MenuItem value="1">ERP</MenuItem>
                        <MenuItem value="2">공용</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="생성 시간"
                        name="createTime"
                        type="datetime-local"
                        value={formData.createTime}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="만료 시간"
                        name="deleteTime"
                        type="datetime-local"
                        value={formData.deleteTime}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" color="secondary" onClick={handleReset}>
                    초기화
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    생성
                </Button>
                <Button variant="outlined" href="/">
                    메인 페이지로 돌아가기
                </Button>
            </Box>
        </Box>
    );
}
