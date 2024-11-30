'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Box, Typography } from '@mui/material';
import { getMonthlyAttendanceAndLeave, markAttendanceLogin, markAttendanceLogout } from "@/app/api/api";
import { AttendanceLeaveData, Leave, Attendance } from "@/app/types/datatype";
import { Button } from "@mui/base";

const AttendanceLeaveCalendar = ({ employeeId }: { employeeId: number }) => {
    const [selectedDate, setSelectedDate] = useState<Date | [Date, Date] | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceLeaveData | null>(null);

    // 해당 월의 출석 및 휴가 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchAttendanceData = async () => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;  // 월은 0부터 시작하므로 1을 더해줍니다.

            try {
                const data = await getMonthlyAttendanceAndLeave(employeeId, year, month);
                setAttendanceData(data);  // 출석 및 휴가 데이터를 상태에 저장
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchAttendanceData();
    }, [employeeId]);  // employeeId가 변경될 때마다 다시 데이터 호출

    // 날짜 변경 처리
    const handleDateChange = (value: Date | [Date, Date] | null) => {
        setSelectedDate(value);
    };

    // 출근 처리
    const handleWorkChange = async () => {
        try {
            const data = await markAttendanceLogin();
            console.log('출근 체크 완료:', data);

            // 출근 데이터를 업데이트 (예시: 당일 출근으로 상태 변경)
            const currentDate = new Date();
            const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            const updatedAttendance = { date: dateString, status: 'Present' };

            setAttendanceData((prevData) => ({
                ...prevData,
                attendance: [...(prevData?.attendance || []), updatedAttendance],
                leaves: prevData?.leaves || [],  // leaves가 undefined인 경우 빈 배열로 설정
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

            // 퇴근 데이터를 업데이트 (예시: 당일 퇴근으로 상태 변경)
            const currentDate = new Date();
            const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            const updatedAttendance = { date: dateString, status: 'Absent' };

            setAttendanceData((prevData) => ({
                ...prevData,
                attendance: [...(prevData?.attendance || []), updatedAttendance],
                leaves: prevData?.leaves || [],  // leaves가 undefined인 경우 빈 배열로 설정
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
                    value={selectedDate}
                    selectRange={true}
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
