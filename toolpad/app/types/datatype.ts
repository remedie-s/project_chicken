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