'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Box, Typography } from '@mui/material';
import {
    getMonthlyAttendance,
    getMonthlyAttendanceAndLeave,
    markAttendanceLogin,
    markAttendanceLogout
} from "@/app/api/api";
import { AttendanceLeaveData } from "@/app/types/datatype";
import { Button } from "@mui/base";
import 'react-calendar/dist/Calendar.css'; // 스타일 적용
import { ko } from 'date-fns/locale';

const AttendanceLeaveCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceLeaveData | null>(null);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    // 해당 월의 출석 및 휴가 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchAttendanceData = async () => {
            if (!currentDate) return;

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            if (!year || !month) return;

            try {
                  const data = await getMonthlyAttendanceAndLeave(year, month);
                 // const data = await getMonthlyAttendance(year, month);

                setAttendanceData(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchAttendanceData();
    }, [currentDate]);

    // 날짜 변경 처리
    const handleDateChange = (value: Date | [Date, Date] | null) => {
        setSelectedDate(value instanceof Date ? value : null);
    };

    // 출근 처리
    const handleWorkChange = async () => {
        try {
            const data = await markAttendanceLogin();
            console.log('출근 체크 완료:', data);

            const currentDate = new Date();
            const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            const updatedAttendance = { date: dateString, status: 'Present' };

            setAttendanceData((prevData) => ({
                ...prevData,
                attendance: prevData ? [...prevData.attendance, updatedAttendance] : [updatedAttendance],
                leaves: prevData?.leaves || []
            }));
        } catch (error) {
            console.error('출근 처리 실패:', error);
        }
    };

    // 퇴근 처리
    const handleOutChange = async () => {
        try {
            const data = await markAttendanceLogout();
            console.log('퇴근 체크 완료:', data);

            const currentDate = new Date();
            const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            const updatedAttendance = { date: dateString, status: 'Absent' };

            setAttendanceData((prevData) => ({
                ...prevData,
                attendance: prevData ? [...prevData.attendance, updatedAttendance] : [updatedAttendance],
                leaves: prevData?.leaves || []
            }));
        } catch (error) {
            console.error('퇴근 처리 실패:', error);
        }
    };

    // 달력 날짜에 표시할 데이터 형식화
    const getDayData = (date: Date): string | null => {
        if (!attendanceData) return null;

        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const attendance = attendanceData.attendance.find(
            (att) => att.date === dateString
        );
        const leave = attendanceData.leaves.find((leave) => leave.date === dateString);

        if (attendance) return `Attendance: ${attendance.status}`;
        if (leave) return 'Leave: Approved';

        return null;
    };

    return (
        <div>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Attendance and Leave Calendar
                </Typography>

                <Calendar
                    onChange={handleDateChange as any}
                    value={selectedDate || currentDate}
                    selectRange={true}
                    locale="ko-KR"
                    tileContent={({ date, view }) => {
                        if (view === 'month') {
                            const dayData = getDayData(date);
                            return dayData ? <div>{dayData}</div> : null;
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
