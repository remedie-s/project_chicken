'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { createPartner } from '@/app/api/api';

/**
 * 파트너 등록 페이지
 *
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
 *
 *     각 항목마다 입력창 있어야함
 *     등록버튼 , 초기화버튼, 대시보드 초기화면으로 돌아가는버튼
 *
 *
 *
 *
 * @constructor
 */

export default function PartnerCreatePage(): JSX.Element {
    const [partnerData, setPartnerData] = useState({
        name: '',
        email: '',
        managerName: '',
        phone: '',
        address: '',
        website: '',
        description: '',
        outstanding: '',
        contactStart: '',
        contactEnd: '',
    });
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    // 입력 핸들러
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPartnerData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 등록 핸들러
    const handleSubmit = async () => {
        try {
            const response = await createPartner({
                ...partnerData,
                outstanding: Number(partnerData.outstanding),
            });
            setMessage('파트너가 성공적으로 등록되었습니다!');
            setTimeout(() => {
                router.push('/dashboard');
            }, 3000);
        } catch (error: any) {
            setMessage(`등록 실패: ${error.message || '알 수 없는 오류'}`);
        }
    };

    // 초기화 핸들러
    const handleReset = () => {
        setPartnerData({
            name: '',
            email: '',
            managerName: '',
            phone: '',
            address: '',
            website: '',
            description: '',
            outstanding: '',
            contactStart: '',
            contactEnd: '',
        });
        setMessage(null);
    };

    // 대시보드 이동 핸들러
    const handleDashboardRedirect = () => {
        router.push('/dashboard');
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                파트너 등록
            </Typography>
            <Grid container spacing={2}>
                {[
                    { label: '파트너 이름', name: 'name', type: 'text' },
                    { label: '파트너 이메일', name: 'email', type: 'email' },
                    { label: '담당자 이름', name: 'managerName', type: 'text' },
                    { label: '전화번호', name: 'phone', type: 'tel' },
                    { label: '주소', name: 'address', type: 'text' },
                    { label: '웹사이트', name: 'website', type: 'url' },
                    { label: '설명', name: 'description', type: 'text' },
                    { label: '미수금', name: 'outstanding', type: 'number' },
                    { label: '협력 시작일', name: 'contactStart', type: 'date' },
                    { label: '협력 마무리일', name: 'contactEnd', type: 'date' },
                ].map((field, index) => (
                    <Grid item xs={12} key={index}>
                        <TextField
                            fullWidth
                            required
                            label={field.label}
                            name={field.name}
                            type={field.type}
                            value={partnerData[field.name as keyof typeof partnerData]}
                            onChange={handleChange}
                        />
                    </Grid>
                ))}
            </Grid>
            {message && (
                <Typography sx={{ mt: 2, color: message.startsWith('등록 실패') ? 'error' : 'primary' }}>
                    {message}
                </Typography>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" color="secondary" onClick={handleReset}>
                    초기화
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    등록
                </Button>
                <Button variant="outlined" color="primary" onClick={handleDashboardRedirect}>
                    대시보드로 이동
                </Button>
            </Box>
        </Box>
    );
}

