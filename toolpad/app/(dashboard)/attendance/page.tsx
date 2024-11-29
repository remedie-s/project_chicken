import * as React from 'react';
import Typography from '@mui/material/Typography';

/**
 * 여기에 출근 목록(달력) 보여지고, 해당 내용은 스프링부트에서 1달치? 30일치? 받아옴
 * 오늘 출근 시간 , 퇴근 시간 보여줌
 * 출근 버튼, 퇴근 버튼 클릭 가능
 * 클릭시 스프링부트 api 주소로 요청 보냄 markAttendanceLogin,  markAttendanceLogout
 * 아래 한달치 출퇴 현황 표로 쏴줌
 * @constructor
 */

export default function AttendancePage(): JSX.Element {
  

  return (
    <Typography>
      Welcome to the Toolpad attendance Page!
    </Typography>
  );
}
