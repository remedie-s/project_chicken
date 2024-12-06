import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Box, Typography } from '@mui/material';
import { getMonthlyAttendanceAndLeave, markAttendanceLogin, markAttendanceLogout } from "../../../api/api";
import { AttendanceLeaveData, SimpleAttendanceLeaveData } from "../../../api/datatype";
import { Button } from "@mui/material"; // @mui/material에서 Button 가져오기

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
        const expandedLeaves = data.leaves.flatMap((leave) => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const dates = [];

            for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
                dates.push({
                    date: new Date(date).toLocaleDateString('en-CA'),
                    status: "Leave",
                });
            }

            return dates;
        });

        return {
            attendance: data.attendance.map((att) => ({
                date: new Date(att.loginTime).toLocaleDateString('en-CA'),
                loginTime: att.loginTime,
                logoutTime: att.logoutTime,
                status: att.leaveCompany ? "퇴근" : "출근중",
            })),
            leaves: expandedLeaves,
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

        if (attendance) {
            if (attendance.status === "출근중") {
                return <div style={{ backgroundColor: 'green', borderRadius: '50%', width: '15px', height: '15px', margin: '0 auto' }} />;
            } else if (attendance.status === "퇴근") {
                return <div style={{ backgroundColor: 'gray', borderRadius: '50%', width: '15px', height: '15px', margin: '0 auto' }} />;
            }
        }

        if (leave) {
            return <div style={{ backgroundColor: 'yellow', borderRadius: '50%', width: '15px', height: '15px', margin: '0 auto' }} />;
        }

        return null;
    };

    const getSelectedDayInfo = () => {
        if (!selectedDate || !attendanceData) return null;

        const dateString = selectedDate.toLocaleDateString('en-CA');
        const attendance = attendanceData.attendance.find((att) => att.date === dateString);

        if (!attendance) return "No attendance data available for this date.";

        const loginTime = attendance.loginTime
            ? new Date(attendance.loginTime).toLocaleTimeString('ko-KR')
            : "출근 기록 없음";

        const logoutTime = attendance.logoutTime
            ? new Date(attendance.logoutTime).toLocaleTimeString('ko-KR')
            : "퇴근 기록 없음";

        return (
            <>
                <Typography>출근 시간: {loginTime}</Typography>
                <Typography>퇴근 시간: {logoutTime}</Typography>
            </>
        );
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
                    출퇴근 기록부
                </Typography>

                <Calendar
                    onChange={handleDateChange as any}
                    value={selectedDate || currentDate}
                    selectRange={false}
                    locale="ko-KR"
                    tileContent={({ date, view }) => {
                        if (view === 'month') {
                            return getDayData(date);
                        }
                        return null;
                    }}
                />

                <Box>
                    <Typography variant="subtitle1" mt={2}>
                        선택한 날짜:
                    </Typography>
                    <Typography variant="body1">
                        {selectedDate instanceof Date
                            ? selectedDate.toLocaleDateString()
                            : '아직 날짜가 선택되지 않았습니다.'}
                    </Typography>

                    <Box mt={2}>
                        {getSelectedDayInfo()}
                    </Box>
                </Box>
            </Box>
            <Box>
                <Button variant="contained" onClick={handleWorkChange}>출근</Button>
                <Button variant="contained" onClick={handleOutChange}>퇴근</Button>
            </Box>
        </div>
    );
};

export default AttendancePage;
