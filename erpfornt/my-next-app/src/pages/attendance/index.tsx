'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Box, Typography } from '@mui/material';
import { getMonthlyAttendanceAndLeave, markAttendanceLogin, markAttendanceLogout } from "../../api/api";
import { AttendanceLeaveData, SimpleAttendanceLeaveData } from "../../api/datatype";
import { Button } from "@mui/base";
import 'react-calendar/dist/Calendar.css';

const AttendancePage = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [attendanceData, setAttendanceData] = useState<SimpleAttendanceLeaveData | null>(null);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [states, setStates] = useState(0);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            setLoading(true);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            try {
                const data = await getMonthlyAttendanceAndLeave(year, month);
                setAttendanceData(processAttendanceData(data));
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [currentDate, states]);

    const processAttendanceData = (data: AttendanceLeaveData): SimpleAttendanceLeaveData => {
        return {
            attendance: data.attendance.map((att) => ({
                date: new Date(att.loginTime).toLocaleDateString('en-CA'),
                status: att.leaveCompany ? "퇴근" : "출근중",  // leaveCompany가 true면 '퇴근', false면 '출근중'
            })),
            leaves: data.leaves.map((leave) => ({
                date: leave.startDate,
                status: "Leave",
            })),
        };
    };

    const handleDateChange = (value: Date | [Date, Date] | null) => {
        if (value instanceof Date) {
            setSelectedDate(value);
        } else {
            setSelectedDate(null);
        }
    };

    const getDayData = (date: Date): string | React.ReactNode | null => {
        if (!attendanceData) return null;

        const dateString = date.toLocaleDateString('en-CA');
        const attendance = attendanceData.attendance.find((att) => att.date === dateString);
        const leave = attendanceData.leaves.find((leave) => leave.date === dateString);

        // 출근중일 경우 초록색 원, 퇴근일 경우 회색 원 표시
        if (attendance) {
            if (attendance.status === "출근중") {
                return <div style={{ backgroundColor: 'green', borderRadius: '50%', width: '15px', height: '15px', margin: '0 auto' }} />;
            } else if (attendance.status === "퇴근") {
                return <div style={{ backgroundColor: 'gray', borderRadius: '50%', width: '15px', height: '15px', margin: '0 auto' }} />;
            }
        }

        // 휴가인 경우
        if (leave) {
            return <div style={{ backgroundColor: 'yellow', borderRadius: '50%', width: '15px', height: '15px', margin: '0 auto' }} />;
        }

        return null;
    };

    const handleWorkChange = async () => {
        try {
            const response = await markAttendanceLogin();
            setStates(1);
            console.log('출근 체크 완료:', response);
        } catch (error) {
            console.error('출근 처리 실패:', error);
        }
    };

    const handleOutChange = async () => {
        try {
            const response = await markAttendanceLogout();
            setStates(2);
            console.log('퇴근 체크 완료:', response);
        } catch (error) {
            console.error('퇴근 처리 실패:', error);
        }
    };

    if (loading || !attendanceData) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Attendance and Leave Calendar
                </Typography>

                <Calendar
                    onChange={handleDateChange as any}
                    value={selectedDate || currentDate}
                    selectRange={false}
                    locale="ko-KR"
                    tileContent={({ date, view }) => {
                        if (view === 'month') {
                            return getDayData(date);  // 날짜에 맞는 상태 아이콘/색상 반환
                        }
                        return null;
                    }}
                />

                <Box>
                    <Typography variant="subtitle1" mt={2}>
                        Selected Date:
                    </Typography>
                    <Typography variant="body1">
                        {selectedDate instanceof Date
                            ? selectedDate.toLocaleDateString()
                            : 'No date selected'}
                    </Typography>
                </Box>
            </Box>
            <Box>
                <Button onClick={handleWorkChange}>출근</Button>
                <Button onClick={handleOutChange}>퇴근</Button>
            </Box>
        </div>
    );
};

export default AttendancePage;
