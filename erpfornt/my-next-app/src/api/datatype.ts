import exp from "node:constants";
import {ReactElement} from "react";

export type signupData={
    email: string;
    name: string;
    password: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    birthDate: string;
    phoneNumber: string;
    department: string;
    position: string;
    salary: number;
    incentive: number;
    hireDate: string;
}

export type loginData = {
    email:string;
    password:string;
}

export type productRegData = {
    id?: number|null;
    name: string;
    description: string;
    price: number;
    createdAt: string; // LocalDateTime은 ISO 8601 형식의 문자열로 변환할 수 있습니다.
    imageUrl: string;
    stock: number;
    sellCount: number;
    category: string;
    mainItemNumber: number;
    event: number;
    brand: string;
    cost: number;
    partnerId: number; // Partner는 별도의 타입으로 정의해야 합니다.
}
export type productData = {
    id?: number|null;
    name: string;
    description: string;
    price: number;
    createdAt: string; // LocalDateTime은 ISO 8601 형식의 문자열로 변환할 수 있습니다.
    imageUrl: string;
    stock: number;
    sellCount: number;
    category: string;
    mainItemNumber: number;
    event: number;
    brand: string;
    cost: number;
    partnerId: number; // Partner는 별도의 타입으로 정의해야 합니다.
}
export type modifyOrderData = {
    id: number;
    invoice:string;
    status: string;

}
export type EmployeeDto = {
    id?: number|null;
    password: string;
    name: string;
    email: string;
    gender: string;
    address: string;
    birthDate: string; // LocalDate는 string으로 처리
    phoneNumber: string;
    department: string;
    position: string;
    salary: number;
    incentive: number;
    hireDate: string; // LocalDateTime은 string으로 처리
    resignationDate: string | null; // LocalDateTime은 string으로 처리, 퇴사일은 null 가능
    annualLeave: number;
    rating: number | null; // rating은 null이 될 수 있음

}
export type FianceDto={
    id?: number|null;
    name: string;
    description: string;
    buyPrice: number;
    sellPrice: number;
    currentPrice: number;
    status: "good" | "normal" | "bad"; // Enum-like for status
    buyTime: string; // LocalDateTime will be represented as an ISO string
    sellTime: string; // LocalDateTime will be represented as an ISO string
}
export type PartnerDto={
    id?: number;
    name: string;
    email: string;
    managerName: string;
    phone: string;
    address: string;
    website: string;
    description: string;
    outstanding: number;
    contactStart: string;
    contactEnd: string;
}
export type OrdersDto={
    id?: number;
    quantity: number;          // 주문 수량
    price: number;             // 주문 시 원가격
    discount: number;          // 주문 시 할인 가격
    payPrice: number;          // 주문 시 실제 최종 가격
    createdAt: string;         // 주문 일자 (ISO 문자열)
    available: boolean;        // 숨김 여부
    invoice: number;           // 배송 번호 (운송장 번호)
    address: string;           // 배송지
    status: string;            // 주문 상태
    userId: number;            // 사용자 ID
    productId: number;         // 상품 ID

}
export type ProductDto={
    id?: number;                  // 상품 ID
    name: string;                // 상품명
    description: string;         // 상품 설명
    price: number;               // 상품 가격
    createdAt: string;           // 상품 생성일 (ISO 문자열)
    imageUrl: string;            // 상품 URL
    stock: number;               // 상품 재고
    sellCount: number;           // 상품 판매량
    category: string;            // 상품 카테고리
    mainItemNumber: number;      // 메인 상품 번호 (ID와 같으면 메인 상품)
    brand: string;               // 브랜드
    event: number;               // 이벤트 번호
    cost: number;                // 원가
    partnerId: number;            // 파트너 정보

}
export interface Partner {
    id?: number;               // 파트너사 ID
    name: string;             // 파트너사 이름
    email: string;            // 파트너사 이메일
    managerName: string;      // 파트너사 담당자 이름
    phone: string;            // 파트너사 핸드폰
    address: string;          // 파트너사 주소
    website: string;          // 파트너사 웹사이트
    description: string;      // 파트너사 내용 (ex: 관계하고 있는 분야)
    outstanding: number;      // 미수금
    contactStart: string;     // 협력 시작일 (ISO 문자열)
    contactEnd: string;       // 협력 마무리일 (ISO 문자열)
}
export interface Attendance {

    id: number;
    loginTime: string;
    logoutTime: string | null; // 로그아웃하지 않았을 수도 있으므로 null 가능
    leaveCompany: boolean;    // 추가된 필드

    employee: {
        id: number;
        name: string;
        email: string;
        // 기타 필요한 필드들 추가
    };
    date?: string; // 날짜
    status?: string; // 출석 상태 ("Present" 또는 "Leave")
}

export interface Leave {

    id: number;
    startDate: string;
    endDate: string;
    reason: string;// 휴가 사유
}

export interface AttendanceLeaveData {
    attendance: Attendance[];
    leaves: Leave[];
}
// 출근/퇴근 및 휴가 상태만 필요한 경우
export interface SimpleAttendance {
    date: string; // 날짜
    status: string; // 출석 상태 ("Present" 또는 "Leave")
}

// 단순화된 AttendanceLeaveData
export interface SimpleAttendanceLeaveData {
    attendance: SimpleAttendance[];
    leaves: SimpleAttendance[];
}
export interface DemoProps {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;

    /**
     * The current path name for routing.
     * Used to determine which page component to render.
     */
    pathname?: string;

    /**
     * A function to handle user authentication status.
     * Can be used to check if a user is logged in or not.
     */
    isAuthenticated?: () => boolean;

    /**
     * A callback function to log out the current user.
     * Used to clear user session and redirect to the login page.
     */
    onLogout?: () => void;

    /**
     * An object that contains user information.
     * This can be used to personalize the dashboard experience.
     */
    userInfo?: {
        name: string;
        email: string;
        role: string; // 예: "admin", "user"
    };

    /**
     * The children elements to be rendered inside the component.
     */
    children?: ReactElement; // children 속성을 추가
}

export interface IPage {
    // 개별 페이지 별 URL
    pathname :string
    session?:any
    children?: React.ReactNode; // children 속성을 추가
}

// 세션용 타입 구성, 타입을 저장하겠다
export type ISession={
    uid:string
    name?:string
    email?:string
}
