import axios from "axios";
import {
    EmployeeDto,
    FianceDto,
    loginData,
    modifyOrderData, modifyProductData, noticeData, NotificationRequest,
    PartnerDto,
    productRegData,
    signupData, TokenData, UsersDto
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

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response.status === 401) && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = sessionStorage.getItem('refreshToken');
            if (!refreshToken) {
                window.location.href = "/employee/login";
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                const { accessToken } = response.data;

                sessionStorage.setItem('accessToken', accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                window.location.href = "/employee/login";
                return Promise.reject(refreshError);
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
        const refreshToken = sessionStorage.getItem("refreshToken"); // 세션 스토리지에서 리프레시 토큰 가져오기
        if (!refreshToken) throw new Error("Refresh token is missing");
        const response = await api.post(`${API_URL}/auth/logout`, {refreshToken},{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // 로그아웃 성공 시 세션 스토리지 비우기
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("name");
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
    try{const response = await api.get(`${API_URL}/products/category/${category}`,{
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
    try{const response = await api.get(`${API_URL}/products/event/${event}`,{
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
    try{const response = await api.get(`${API_URL}/products/${productId}`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const productModify = async (modifyProduct:modifyProductData)=>{
    try{const response = await api.put(`${API_URL}/products/${modifyProduct.id}`,modifyProduct,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const productReview = async (productId:number)=>{
    try{const response = await api.get(`${API_URL}/products/review/${productId}`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const productReviewDelete = async (reviewId:number)=>{
    try{const response = await api.get(`${API_URL}/products/review/${reviewId}`,{
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
        const response = await api.get(`${API_URL}/employee/list/admin`, {
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
export const getEmployeeDetailAdmin = async (id: number) => {
    try {
        const response = await api.get(`${API_URL}/employee/admin/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 직원 상세 정보 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const modifyEmployee = async (id: number, employeeData: EmployeeDto) => {
    try {
        const response = await api.put(`${API_URL}/employee/modify/${id}`, employeeData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 변경된 직원 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const deleteEmployee = async (id: number) => {
    try {
        const response = await api.delete(`${API_URL}/employee/delete/${id}`, {
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

// 유저 관리 메소드
export const getUserList = async () => {
    try {
        const response = await api.get(`${API_URL}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 직원 리스트 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};

export const modifyUser = async (usersDto: UsersDto) => {//TODO
    try {
        const response = await api.put(`${API_URL}/user/modify}`, usersDto, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 변경된 직원 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
export const deleteUser = async (id: number) => {//TODO
    try {
        const response = await api.delete(`${API_URL}/employee/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 변경된 직원 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패 시 에러 반환
    }
};
// 모든 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출하는 API 호출
export const getAllFianceData = async () => {
    try {
        const response = await api.get('${API_URL}/fiance/all');
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 특정 기간의 데이터를 로드하는 API 호출
export const getFianceDataByDate = async (startDate: string, endDate: string) => {
    try {
        const response = await api.get('${API_URL}/fiance/date', {
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
        const response = await api.get('${API_URL}/fiance/cate', {
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
        const response = await api.get('${API_URL}/fiance/inner');
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 내부 재산을 생성하는 API 호출
export const createInnerFianceData = async (fianceDto: FianceDto) => {
    try {
        const response = await api.post('${API_URL}/fiance/inner/create', fianceDto, {
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
        const response = await api.delete(`${API_URL}/fiance/inner/${innerId}`);
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// 내부 재산을 수정하는 API 호출
export const updateInnerFianceData = async (innerId: number, fianceDto: FianceDto) => {
    try {
        const response = await api.put(`${API_URL}/fiance/inner/${innerId}`, fianceDto, {
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

// FCM 관련 메시지
// FCM 토큰 저장
export const storeToken = async (tokenData:TokenData ) => {
    try {
        const response = await api.put(`${API_URL}/fcm/storeToken`, tokenData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 수정된 파트너 데이터 반환
    } catch (error: any) {
        console.error("Error storing FCM token:", error);
        throw error.response.data; // 실패 시 에러 반환
    }
};

// FCM 토큰 저장 여부 확인
export const getFCMIsStore = async () => {
    try {
        const response = await api.get('${API_URL}/fcm/isStore');
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};
// FCM 알림 전송
export const sendNotification = async (notificationRequest:NotificationRequest ) => {
    try {
        const response = await api.put(`${API_URL}/fcm/sendNotification`, notificationRequest, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 수정된 파트너 데이터 반환
    } catch (error: any) {
        console.error("Error storing FCM token:", error);
        throw error.response.data; // 실패 시 에러 반환
    }
};

// 공지사항 관리
export const noticeList = async ()=>{
    try{const response = await api.get(`${API_URL}/notice/list`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const noticeAdminList = async ()=>{
    try{const response = await api.get(`${API_URL}/notice/list/admin`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const noticeDetail = async (noticeId:number)=>{
    try{const response = await api.get(`${API_URL}/notice/detail/${noticeId}`,{
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const noticeModify = async (noticeData:noticeData)=>{
    try{const response = await api.put(`${API_URL}/notice/modify`,noticeData, {
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const noticeCreate = async (noticeData:noticeData)=>{
    try{const response = await api.post(`${API_URL}/notice/create`,noticeData, {
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const noticeDelete = async (noticeId:number)=>{
    try{const response = await api.delete(`${API_URL}/notice/delete/{noticeId}`, {
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const chatPublic = async ()=>{
    try{const response = await api.get(`${API_URL}/chats/public`, {
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
export const chatPrivate = async (sender:string,receiver:string)=>{
    try{const response = await api.get(`${API_URL}/chats/private/${sender}/${receiver}`, {
        headers :{
            'Content-Type' :'application/json',
        },
    });
        return response.data;}// 성공시
    catch(error:any){
        throw error.response.data; // 실패시
    }
}
// 질문 전체 리스트 불러오기
export const getAllQuestions = async () => {
    try {
        const response = await api.get('/answers/questions');
        return response.data; // 질문 리스트 반환
    }     catch(error:any){
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};

// 특정 질문의 답변 리스트 불러오기
export const getAnswersByQuestionId = async (questionId:number) => {
    try {
        const response = await api.get(`/answers/question/${questionId}`);
        return response.data; // 답변 리스트 반환
    }     catch(error:any){
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};

// 질문 상세 페이지 불러오기
export const getQuestionById = async (id:number) => {
    try {
        const response = await api.get(`/answers/question/${id}/details`);
        return response.data; // 질문 상세 정보 반환
    } catch (error:any) {
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};

// 질문 생성
export const createQuestion = async (questionData:any) => {
    try {
        const response = await api.post('/answers/question', questionData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 생성된 질문 반환
    }     catch(error:any){
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};

// 질문 수정
export const updateQuestion = async (id:number, questionData:any) => {
    try {
        const response = await api.put(`/answers/question/${id}`, questionData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 수정된 질문 반환
    }     catch(error:any){
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};

// 질문 삭제
export const deleteQuestion = async (id:number) => {
    try {
        const response = await api.delete(`/answers/question/${id}`);
        return response.data; // 삭제된 질문 반환
    }     catch(error:any){
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};

// 답변 생성
export const createAnswer = async (answerData:any) => {
    try {
        const response = await api.post('/answers/answer', answerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 생성된 답변 반환
    }     catch(error:any){
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};

// 답변 수정
export const updateAnswer = async (id:number, answerData:any) => {
    try {
        const response = await api.put(`/answers/answer/${id}`, answerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 수정된 답변 반환
    } catch (error:any) {
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};

// 답변 삭제
export const deleteAnswer = async (id:number) => {
    try {
        const response = await api.delete(`/answers/answer/${id}`);
        return response.data; // 삭제된 답변 반환
    } catch (error:any) {
        throw error.response.data; // 오류 발생 시 에러 반환
    }
};








