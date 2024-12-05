import * as React from 'react';
import { AppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Navigation } from '@toolpad/core/AppProvider';

import theme from '../theme';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },

  {
    segment: 'login',
    title: '로그인/로그아웃',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'attendance',
    title: '출근/퇴근',
    icon: <ShoppingCartIcon />,
  },
  
  {
    segment: 'finances',
    title: '재무 관리',
    icon: <ShoppingCartIcon />,
    children: [
      {
        segment: "create",
        title: "재산 등록",
        icon: <ShoppingCartIcon />,
      },
    ]
  },
  {
    segment: 'partner',
    title: '파트너사 관리',
    icon: <ShoppingCartIcon />,
    children: [
      {
        segment: "create",
        title: "파트너사 등록",
        icon: <ShoppingCartIcon />,
      },
  ]
  },
  {
    segment: 'orders',
    title: '고객주문관리',
    icon: <ShoppingCartIcon />,
    children: [
      {
        segment: "[id]",
        title: "주문상세페이지",
        icon: <ShoppingCartIcon />,
      },
      {
        segment: "product",
        title: "물품별페이지",
        icon: <ShoppingCartIcon />,
      }
    ]
  },
  {
    segment: 'products',
    title: '등록 물품 관리',
    icon: <ShoppingCartIcon />,
    children: [
      {
        segment: "create",
        title: "물품 등록",
        icon: <ShoppingCartIcon />,
      },
    ]
  },
  {
    segment: 'notice',
    title: '공지사항 관리',
    icon: <DashboardIcon />,
  },
  {
    segment: 'qna',
    title: '큐엔에이(대표질문)관리',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'answer',
    title: '답변 관리',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'users',
    title: '고객관리',
    icon: <ShoppingCartIcon />,
  },

];

const BRANDING = {
  title: 'My Toolpad Core Next.js App',
};



export default function RootLayout(props: { children: React.ReactNode }) {
  

  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <AppProvider
              navigation={NAVIGATION}
              branding={BRANDING}
              
              theme={theme}
            >
              {props.children}
            </AppProvider>
          </AppRouterCacheProvider>
        
      </body>
    </html>
  );
}
