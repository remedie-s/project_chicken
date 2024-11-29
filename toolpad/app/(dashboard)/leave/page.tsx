import * as React from 'react';
import Typography from '@mui/material/Typography';

/**
 * 여기에 출근 목록(달력) 보여지고, 해당 내용은 스프링부트에서 1달치? 30일치? 받아옴
 *
 * 달력 나오고 거기서 날짜 입력가능?
 * 그냥 날짜 입력하고
 * 휴일 제외하고 입력이 되어야함
 * 스프링 부트에서 남은 연가일 수 가져와야함
 *  employeeId: number,
 *  reason: string,
 *  startDate: string,
 *  endDate: string
 *
 * @constructor
 */

export default function LeavePage(): JSX.Element {
  

  return (
    <Typography>
      Welcome to the Toolpad attendance Page!
    </Typography>
  );
}
