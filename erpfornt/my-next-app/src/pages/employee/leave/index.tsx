import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { requestLeave, getEmployeeLeaves, cancelLeave } from "../../../api/api";
import { Leave } from "../../../api/datatype";

const LeavePage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [remainingLeaves, setRemainingLeaves] = useState<number>(0);
    const [leaveList, setLeaveList] = useState<Leave[]>([]); // 기본값을 빈 배열로 설정

    // 직원의 남은 연차일 및 휴가 목록 불러오기
    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const leaves: Leave[] = await getEmployeeLeaves(); // 배열로 처리
                console.log('Fetched leaves:', leaves);

                if (Array.isArray(leaves) && leaves.length > 0) {
                    const employee = leaves[0].employee; // 첫 번째 휴가 항목에서 직원 정보 가져오기
                    if (employee) {
                        setRemainingLeaves(employee.annualLeave); // 남은 연차일 설정
                    }
                    setLeaveList(leaves); // 휴가 목록 설정
                } else {
                    console.error('leaves가 유효한 배열이 아닙니다.');
                    setLeaveList([]); // 유효하지 않을 경우 빈 배열로 설정
                }
            } catch (error) {
                console.error('Failed to fetch leave data:', error);
                setLeaveList([]); // 에러 시 빈 배열 설정
            }
        };

        fetchLeaves();
    }, []);

    // 휴가 요청
    const handleRequestLeave = async () => {
        if (!selectedDate || !endDate || !reason) {
            alert('모든 필드를 입력하세요.');
            return;
        }

        try {
            await requestLeave(reason, selectedDate.toISOString().split('T')[0], endDate);
            alert('휴가 요청이 성공적으로 제출되었습니다.');
            setReason('');
            setSelectedDate(null);
            setEndDate('');
            // 휴가 목록 갱신
            const leaves = await getEmployeeLeaves();
            setLeaveList(leaves);
        } catch (error) {
            alert(`휴가 요청 실패: ${error}`);
        }
    };

    // 휴가 취소
    const handleCancelLeave = async (id: number) => {
        try {
            await cancelLeave(id);
            alert('휴가가 성공적으로 취소되었습니다.');
            // 휴가 목록 갱신
            const leaves = await getEmployeeLeaves();
            setLeaveList(leaves);
        } catch (error) {
            alert(`휴가 취소 실패: ${error}`);
        }
    };

    // 휴가일 표시
    const getLeaveDates = () => {
        return leaveList.flatMap((leave) => {
            const dates = [];
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            let currentDate = start;

            while (currentDate <= end) {
                dates.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return dates;
        });
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
                tileContent={({ date }) => {
                    const leaveDates = getLeaveDates();
                    if (leaveDates.includes(date.toISOString().split('T')[0])) {
                        return (
                            <div
                                style={{
                                    backgroundColor: 'green',
                                    borderRadius: '50%',
                                    width: '5px',
                                    height: '5px',
                                    margin: 'auto',
                                }}
                            />
                        );
                    }
                    return null;
                }}
            />
            <Typography variant="body1" gutterBottom>
                휴가 시작일: {selectedDate ? selectedDate.toLocaleDateString() : '날짜를 선택하세요.'}
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
                    variant="filled"
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
                                {leave.startDate} ~ {leave.endDate}
                                <br />
                                휴가 사유: {leave.reason}
                                <br />
                                직원 이름: {leave.employee?.name || '정보 없음'}
                                <br />
                                직원 이메일: {leave.employee?.email || '정보 없음'}
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
