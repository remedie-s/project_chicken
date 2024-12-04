import axios from "axios";
import {
    EmployeeDto,
    FianceDto,
    loginData,
    modifyOrderData,
    PartnerDto,
    productRegData,
    signupData
} from "./datatype";

const API_URL =  'http://localhost:8081/api'; // spring boot ERP 페이지
// const API_URL =  'http://192.168.0.8:8081/api'; // spring boot ERP 페이지- 차후 서버페이지로 변경
const api = axios.create({
    baseURL:API_URL, // Spring Boot 서버의 URL
})
// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken'); // 세션 스토리지에서 토큰 가져오기
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// 요청 인터셉터 추가
api.interceptors.response.use(
    response => response, // 정상 응답은 그대로 반환
    async (error) => {
        const originalRequest = error.config;

        // 액세스 토큰 만료로 인한 오류 처리 (401 Unauthorized)
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = sessionStorage.getItem('refreshToken'); // 세션에서 리프레시 토큰 가져오기

            // 리프레시 토큰이 없거나 만료된 경우, 다시 로그인 화면으로 리디렉션
            if (!refreshToken) {
                window.location.href = "/login"; // 로그인 화면으로 리디렉션
                return Promise.reject(error);
            }

            try {
                // 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급 요청
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                const { accessToken } = response.data;

                // 새로운 액세스 토큰을 세션 스토리지에 저장
                sessionStorage.setItem('accessToken', accessToken);

                // 원래 요청에 새로운 액세스 토큰을 헤더에 추가
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // 원래 요청을 재시도
                return api(originalRequest);
            } catch (refreshError) {
                // 리프레시 토큰이 만료되거나 잘못된 경우 로그아웃 처리
                window.location.href = "/login"; // 로그인 화면으로 리디렉션
                return Promise.reject(refreshError);
            }
        }

        // 액세스 토큰이 만료되지 않았을 경우
        if (error.response.status !== 401) {
            const accessToken = sessionStorage.getItem('accessToken'); // 세션에서 액세스 토큰 가져오기
            if (accessToken) {
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }

        return Promise.reject(error);
    }
);


export const signup = async (userData:signupData)=>{
    try{
        const response = await api.post(`${API_URL}/auth/register`,userData, {
            headers :{
                'Content-Type' :'application/json',
            },
        });
        return response.data; // 성공시
    } catch(error:any){
        throw error.response.data; // 실패시
    }
}

export const login = async (loginUserData:loginData)=>{
    try{
        const response = await api.post(`${API_URL}/auth/login`,loginUserData, {
            headers :{
                'Content-Type' :'application/json',
            },
        });
        return response.data; // 성공시
    } catch(error:any){
        throw error.response.data; // 실패시
    }
}

export const logout = async ()=> {
    try {
        const response = await api.get(`${API_URL}/auth/logout`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공시
    } catch (error: any) {
        throw error.response.data; // 실패시
    }
}

export const productReg = async (productData:productRegData)=>{
    try{
        const response = await api.post(`${API_URL}/products/create`,productData, {
            headers :{
                'Content-Type' :'application/json',
            },
        });
        return response.data; // 성공시
    } catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const productList = async ()=>{
    try{const response = await api.get(`${API_URL}/products/all`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const productListCate = async (category:string)=>{
    try{const response = await api.get(`${API_URL}/product/category/${category}`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const productListEvent = async (event:number)=>{
    try{const response = await api.get(`${API_URL}/product/event/${event}`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}


export const productDetail = async (productId:number)=>{
    try{const response = await api.get(`${API_URL}/product/${productId}`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}

export const orderList = async ()=>{
    try{const response = await api.get(`${API_URL}/order/all`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const orderListUser = async (userId:number)=>{
    try{const response = await api.get(`${API_URL}/order/user/${userId}`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}

export const orderListProduct = async (productId:number)=>{
    try{const response = await api.get(`${API_URL}/order/product/${productId}`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const orderDetail = async (orderId:number)=>{
    try{
        const response = await api.put(`${API_URL}/order/${orderId}`, {
            headers :{
                'Content-Type' :'application/json',
            },
        });
        return response.data; // 성공시
    } catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const orderModify = async (orderData:modifyOrderData)=>{
    try{
        const response = await api.put(`${API_URL}/order/${orderData.id}`,orderData, {
            headers :{
                'Content-Type' :'application/json',
            },
        });
        return response.data; // 성공시
    } catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const orderDelete = async (orderId:number)=>{
    try{
        const response = await api.delete(`${API_URL}/order/${orderId}`, {
            headers :{
                'Content-Type' :'application/json',
            },
        });
        return response.data; // 성공시
    } catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const getEmployeeList = async () => {
    try {
        const response = await api.get(`${API_URL}/employee/list`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 직원 리스트 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const getEmployeeListByEX = async () => {
    try {
        const response = await api.get(`${API_URL}/employee/list/ex`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 직원 리스트 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const getEmployeeDetail = async (id: number) => {
    try {
        const response = await api.get(`${API_URL}/employee/detail/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 직원 상세 정보 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const modifyEmployee = async (id: number, employeeData: EmployeeDto) => {//TODO
    try {
        const response = await api.post(`${API_URL}/employee/modify/${id}`, employeeData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 변경된 직원 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const getEmployeeAttendance = async (id: number) => {
    try {
        const response = await api.get(`${API_URL}/employee/attendance/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 직원 상세 정보 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const markAttendanceLogin = async () => {
    try {
        const response = await api.post(`${API_URL}/employee/attendance/login`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 출근 체크 완료 메시지 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const markAttendanceLogout = async () => {
    try {
        const response = await api.post(`${API_URL}/employee/attendance/logout`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 퇴근 체크 완료 메시지 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const getMonthlyAttendanceAndLeave = async (
    year: number,
    month: number
) => {
    try {
        const response = await api.post(`${API_URL}/employee/getAttLea/${year}/${month}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const getMonthlyAttendance = async (year:any,month:any) => {
    try {
        const response = await api.post(`${API_URL}/employee/attendance/${year}/${month}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 퇴근 체크 완료 메시지 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};

export const requestLeave = async (
    reason: string,
    startDate: string,
    endDate: string
) => {
    try {
        const response = await api.post(
            `${API_URL}/employee/leave/request`,
            null,
            {
                params: { reason, startDate, endDate },
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data; // 성공 시 휴가 요청 성공 메시지 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const getEmployeeLeaves = async () => {
    try {
        const response = await api.get(`${API_URL}/employee/leave`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 직원의 휴가 목록 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};

export const cancelLeave = async (leaveId:number) => {
    try {
        const response = await api.delete(`${API_URL}/employee/leave/cancel/${leaveId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 휴가 취소 완료 메시지 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const getEmployeesByDepartment = async (department: string) => {
    try {
        const response = await api.get(`${API_URL}/employee/list/department/${department}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 부서별 직원 목록 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const getAnnualLeave = async (employeeId: number) => {
    try {
        const response = await api.get(`${API_URL}/employee/leave/annual/${employeeId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 연차 정보 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
// 모든 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출하는 API 호출
export const getAllFianceData = async () => {
    try {
        const response = await api.get('/fiance/all');
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 특정 기간의 데이터를 로드하는 API 호출
export const getFianceDataByDate = async (startDate: string, endDate: string) => {
    try {
        const response = await api.get('/fiance/date', {
            params: {
                startDate,
                endDate
            }
        });
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 카테고리별 데이터를 로드하는 API 호출
export const getFianceDataByCategory = async (category: string) => {
    try {
        const response = await api.get('/fiance/cate', {
            params: { category }
        });
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 내부 재산 데이터를 조회하는 API 호출
export const getInnerFianceData = async () => {
    try {
        const response = await api.get('/fiance/inner');
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 내부 재산을 생성하는 API 호출
export const createInnerFianceData = async (fianceDto: FianceDto) => {
    try {
        const response = await api.post('/fiance/inner/create', fianceDto, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 내부 재산을 삭제하는 API 호출
export const deleteInnerFianceData = async (innerId: number) => {
    try {
        const response = await api.delete(`/fiance/inner/${innerId}`);
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 내부 재산을 수정하는 API 호출
export const updateInnerFianceData = async (innerId: number, fianceDto: FianceDto) => {
    try {
        const response = await api.put(`/fiance/inner/${innerId}`, fianceDto, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// Partner 관련 API 호출

// 모든 파트너 조회
export const getAllPartners = async () => {
    try {
        const response = await api.get(`${API_URL}/partner/all`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 모든 파트너 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};

// ID로 파트너 조회
export const getPartnerById = async (id: number) => {
    try {
        const response = await api.get(`${API_URL}/partner/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 파트너 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};

// 파트너 등록
export const createPartner = async (partnerData: PartnerDto) => {
    try {
        const response = await api.post(`${API_URL}/partner/create`, partnerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 등록된 파트너 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};

// 파트너 수정
export const updatePartner = async (id: number, partnerData: PartnerDto) => {
    try {
        const response = await api.put(`${API_URL}/partner/${id}`, partnerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 수정된 파트너 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};

// 파트너 삭제
export const deletePartner = async (id: number) => {
    try {
        const response = await api.delete(`${API_URL}/partner/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 파트너 삭제 완료
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};










