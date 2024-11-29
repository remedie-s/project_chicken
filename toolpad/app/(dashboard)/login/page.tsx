import * as React from 'react';
import Typography from '@mui/material/Typography';

/**
 * 로그인이라고 텍스트, 로그인 아이디 입력창, 패스워드 입력창, 로그인 버튼, 회원가입 버튼
 * 입력을 받아서 유효성 검사
 * 로그인 성공시 세션스토리지에 name, email, accessToken, refreshToken 받아서 저장
 * 저장완료 메시지 뜨고 3초후 메인페이지로 이동합니다 메시지나오고 대시보드 메인으로 복귀
 * @constructor
 */

export default function LoginPage(): JSX.Element {
  

  return (
    <Typography>
      Welcome to the Toolpad Login!
    </Typography>
  );
}
