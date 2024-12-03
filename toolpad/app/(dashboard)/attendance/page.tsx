'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Box, Typography } from '@mui/material';
import { getMonthlyAttendanceAndLeave, markAttendanceLogin, markAttendanceLogout } from "@/app/api/api";
import {AttendanceLeaveData, SimpleAttendanceLeaveData} from "@/app/types/datatype";
import { Button } from "@mui/base";
import 'react-calendar/dist/Calendar.css';

const AttendanceLeaveCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceLeaveData | null>(null);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            setLoading(true);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            try {
                const data = await getMonthlyAttendanceAndLeave(year, month);
                setAttendanceData(processAttendanceData(data)); // 제대로 된 타입으로 설정
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [currentDate]);


    // 데이터를 로컬 시간대에 맞게 가공하는 함수
    const processAttendanceData = (data: AttendanceLeaveData): AttendanceLeaveData => {
        return {
            attendance: data.attendance.map((att) => ({
                id: att.id,
                loginTime: att.loginTime,
                logoutTime: att.logoutTime,
                leaveCompany: att.leaveCompany,
                employee: att.employee,
                date: new Date(att.loginTime).toLocaleDateString('en-CA'),
                status: att.leaveCompany ? "Leave" : "Present"
            })),
            leaves: data.leaves.map((leave) => ({
                id: leave.id,
                date: leave.date,
                reason: leave.reason
            }))
        };
    };


    const handleDateChange = (value: Date | [Date, Date] | null) => {
        setSelectedDate(value instanceof Date ? value : null);
    };

    const getDayData = (date: Date): string | null => {
        if (!attendanceData) return null;

        const dateString = date.toLocaleDateString('en-CA'); // ISO 형식: YYYY-MM-DD
        const attendance = attendanceData.attendance.find((att) => att.date === dateString);
        const leave = attendanceData.leaves.find((leave) => leave.date === dateString);

        if (attendance) return `Attendance: ${attendance.status}`;
        if (leave) return 'Leave: Approved';

        return null;
    };

    const handleWorkChange = async () => {
        try {
            const response = await markAttendanceLogin();
            console.log('출근 체크 완료:', response);
        } catch (error) {
            console.error('출근 처리 실패:', error);
        }
    };

    const handleOutChange = async () => {
        try {
            const response = await markAttendanceLogout();
            console.log('퇴근 체크 완료:', response);
        } catch (error) {
            console.error('퇴근 처리 실패:', error);
        }
    };

    if (loading) {
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
                            const dayData = getDayData(date);
                            return dayData ? (
                                <div style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                                    {dayData}
                                </div>
                            ) : null;
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

export default AttendanceLeaveCalendar;
