import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { requestLeave, getEmployeeLeaves, cancelLeave } from "../../api/api";
import { Leave } from "../../api/datatype";

const LeavePage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [remainingLeaves, setRemainingLeaves] = useState<number>(0);
    const [leaveList, setLeaveList] = useState<Leave[]>([]);  // 기본값을 빈 배열로 설정
    const employeeId = 1; // Replace with dynamic employee ID

    // 직원의 남은 연차일 및 휴가 목록 불러오기
    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const leaves = await getEmployeeLeaves(employeeId);
                setRemainingLeaves(leaves.remaining); // 남은 연차일
                setLeaveList(leaves.list || []); // 휴가 목록, 기본값 빈 배열로 설정
            } catch (error) {
                console.error('Failed to fetch leave data:', error);
            }
        };

        fetchLeaves();
    }, [employeeId]);

    // 휴가 요청
    const handleRequestLeave = async () => {
        if (!selectedDate || !endDate || !reason) {
            alert('모든 필드를 입력하세요.');
            return;
        }

        try {
            await requestLeave(employeeId, reason, selectedDate.toISOString().split('T')[0], endDate);
            alert('휴가 요청이 성공적으로 제출되었습니다.');
            setReason('');
            setSelectedDate(null);
            setEndDate('');
            // 휴가 목록 갱신
            const leaves = await getEmployeeLeaves(employeeId);
            setLeaveList(leaves.list || []); // 기본값 빈 배열로 설정
        } catch (error) {
            alert(`휴가 요청 실패: ${error}`);
        }
    };

    // 휴가 취소
    const handleCancelLeave = async (leaveId: number) => {
        try {
            await cancelLeave(leaveId);
            alert('휴가가 성공적으로 취소되었습니다.');
            // 휴가 목록 갱신
            const leaves = await getEmployeeLeaves(employeeId);
            setLeaveList(leaves.list || []); // 기본값 빈 배열로 설정
        } catch (error) {
            alert(`휴가 취소 실패: ${error}`);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Leave Management
            </Typography>

            {/* 남은 연차일 표시 */}
            <Typography variant="h6" gutterBottom>
                남은 연차일: {remainingLeaves}
            </Typography>

            {/* 달력 */}
            <Calendar
                onChange={setSelectedDate as any}
                value={selectedDate}
                tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6} // 주말 비활성화
            />
            <Typography variant="body1" gutterBottom>
                선택된 날짜: {selectedDate ? selectedDate.toLocaleDateString() : '날짜를 선택하세요.'}
            </Typography>

            {/* 휴가 요청 입력 */}
            <Box sx={{ mt: 2 }}>
                <TextField
                    label="휴가 사유"
                    variant="outlined"
                    fullWidth
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="종료 날짜"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleRequestLeave}>
                    휴가 요청
                </Button>
            </Box>

            {/* 휴가 목록 */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">휴가 목록</Typography>
                {leaveList.length > 0 ? (
                    <ul>
                        {leaveList.map((leave) => (
                            <li key={leave.id}>
                                {leave.startDate} ~ {leave.endDate}: {leave.reason}
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    onClick={() => handleCancelLeave(leave.id)}
                                    sx={{ ml: 2 }}
                                >
                                    취소
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography>등록된 휴가가 없습니다.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default LeavePage;
