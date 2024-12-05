
# Create Toolpad App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-toolpad-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup

Run `npx auth secret` to generate a secret and replace the value in the .env.local file with it.

Add the CLIENT_ID and CLIENT_SECRET from your OAuth provider to the .env.local file.

## Getting Started

First, run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

라우트 매핑
(dashboard) 내부의 라우트:
(dashboard) 폴더는 App Router에서 그룹화된 경로를 나타냅니다. 이는 URL에 영향을 주지 않고 라우트를 논리적으로 구성하는 데 사용됩니다.

/answer/[id]: 특정 답변 페이지.
예: /answer/123 → 123번 답변 보기.
/attendance: 출석 관련 페이지.
/finances/create: 금융 데이터 생성 페이지.
/leave: 휴가 관련 페이지.
/login: 로그인 페이지.
/notice: 공지사항 페이지.
/orders/[id]: 특정 주문 상세 페이지.
예: /orders/456 → 456번 주문 보기.
/orders/product/[id]: 특정 제품 관련 주문 상세 페이지.
예: /orders/product/789 → 789번 제품 관련 주문.
/orders/users/[id]: 특정 사용자 관련 주문 페이지.
예: /orders/users/123 → 123번 사용자 관련 주문.
/partner/create: 파트너 등록 페이지.
/products/[id]: 특정 제품 상세 페이지.
예: /products/999 → 999번 제품 보기.
/qna: Q&A 페이지.
/signup: 회원가입 페이지.
/users: 사용자 관리 페이지.