export type signupData={
    name:string;
    password:string;
    email:string;
    gender:string;
    address:string;
    birthDate:string;
    phoneNumber:string;
    department:string;
    position:string;
    salary:number;
    incentive:number;
    hireDate:string;
    resignationDate:string;
    annualLeave:number;
    rating:number;
}

export type loginData = {
    email:string;
    password:string;
}

export type productRegData = {
    id: number|null;
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
    id: number|null;
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
    id: number|null;
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
    id: number;
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
    id: number;
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
    id: number;                  // 상품 ID
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
    id: number;               // 파트너사 ID
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
