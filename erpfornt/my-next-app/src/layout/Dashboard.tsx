import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout, type SidebarFooterProps } from "@toolpad/core/DashboardLayout";
import { Typography, Box, styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { useRouter } from "next/router";

// MUI Icons
import {
    LockOpen,
    Login,
    Logout,
    Input,
    Store,
    ShoppingBag,
    Home,
} from "@mui/icons-material";

// Page Components
import LoginPage from "../pages/employee/login";
import LogoutPage from "../pages/employee/logout";
import SignupPage from "../pages/employee/signup";
import AttendancePage from "@/pages/employee/attendance/index";
import ProductCreatePage from "../pages/products/create";
import LeavePage from "@/pages/employee/leave/index";
import OrdersPage from "@/pages/orders/index";
import UserAdminPage from "@/pages/admin/userList";

// 타입 정의
import type { DemoProps, IPage } from "@/api/datatype";
import type { Navigation, Router } from "@toolpad/core";
import Index from "@/pages/products";
import Leave from "@/pages/employee/leave/index";
import Notice from "@/pages/notice";
import FinancesCreate from "@/pages/finances/create";
import FinancePage from "@/pages/finances/QuarterlySummaryPage";
import OrderSummaryPage from "@/pages/finances/QuarterlySummaryPage";
import QuarterlySummaryPage from "@/pages/finances/QuarterlySummaryPage";
import AnnualSummaryPage from "@/pages/finances/AnnualSummaryPage";
import OrderTable from "@/pages/orders/quarter";
import InnerPage from "@/pages/finances/innerPage";
import OrdersUsersPage from "@/pages/orders/users";
import OrdersProductPage from "@/pages/orders/product";
import ProductDetailPage from "@/pages/products/detail";
import ProductEditPage from "@/pages/products/edit/[id]";
import PartnerIndex from "@/pages/partner";
import PartnerCreate from "@/pages/partner/create";
import EmployeeAdminPage from "@/pages/admin/empList";
import EmployeePage from "@/pages/employee/list";
import {useFCM} from "@/hooks/useFCM";

// firebase
import "@/utils/firebase"
import NoticeDetailPage from "@/pages/notice/detail";

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
    },
});


// 세션 관리
function useSession() {
    const [session, setSession] = React.useState<{ user: { name: string | null; email: string | null; roles:string|null; } } | null>(null);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const roles = JSON.parse(sessionStorage.getItem("roles") || "[]");
            const email = sessionStorage.getItem("email");
            const name = sessionStorage.getItem("name");

            if (email && name && roles) {
                setSession({ user: { name, email,roles } });
            }
        }
    }, []);

    return { session, setSession };
}

// SidebarFooter Component
function SidebarFooter({ mini }: SidebarFooterProps) {
    return (
        <Typography variant="caption" sx={{ m: 1, whiteSpace: "nowrap", fontSize: "1.0em" }}>
            {mini ? "© MUI" : `© ${new Date().getFullYear()} Made with love by 4C Creator`}
        </Typography>
    );
}

// UserAccountAndCart Component
function UserAccountAndCart() {
    const [email, setEmail] = React.useState<string | null>(null);
    const [name, setName] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setEmail(sessionStorage.getItem("email"));
            setName(sessionStorage.getItem("name"));
        }
    }, []);

    return (
        <>
            {name && email ? (
                <Typography variant="h6">안녕하세요, {name}님 이메일: {email}</Typography>
            ) : (
                <Typography variant="h6" onClick={() => router.push("/employee/login")}>
                    먼저, 로그인을 해주세요. 미 로그인시 사이트 접속이 제한됩니다.
                </Typography>
            )}
        </>
    );
}

// DemoPageContent Component
function DemoPageContent({ pathname, session}: IPage) {

    if(session!=null) {
        const {roles} = session.user;
        const isAdmin = roles.includes("ADMIN");
        const isUser = roles.includes("USER");
        const isManager = roles.includes("MANAGER");
        const isPURCHASING = roles.includes("PURCHASING");
        const isFINANCE = roles.includes("FINANCE");
        const isHUMAN_RESOURCE = roles.includes("HUMAN_RESOURCE");
        const CUSTOMER_SERVICE = roles.includes("CUSTOMER_SERVICE");


        switch (pathname) {
            // @ts-ignore
            case pathname.startsWith("/products/edit"):
                return isAdmin || isPURCHASING ? <ProductEditPage/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;

            case "/employee/login":
                return <LoginPage/>;
            case "/employee/logout":
                return <LogoutPage/>;
            case "/employee/signup":
                return <SignupPage/>;
            case "/employee/leave":
                return <LeavePage/>;
            case "/employee/attendance":
                return <AttendancePage/>;
            case "/employee/list":
                return <EmployeePage/>;
            case "/products/productCreate":
                return isAdmin || isPURCHASING ? <ProductCreatePage/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;
            case "/products/index":
                return <Index/>;
            case "/products/detail":
                return <ProductDetailPage/>;

            case "/orders":
                return <OrdersPage/>;
            case "/partner/create":
                return isAdmin || isPURCHASING ? <PartnerCreate/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;
            case "/partner/index":
                return <PartnerIndex/>;
            case "/orders/product":
                return <OrdersProductPage/>;
            case "/orders/users":
                return <OrdersUsersPage/>;
            case "/orders/quarter":
                return isAdmin || isFINANCE || isPURCHASING ? <OrderTable/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;
            case "/dashboard":
                return <Notice/>;
            case "/finances/create":
                return isAdmin || isFINANCE ? <FinancesCreate/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;

            case "/finances/innerPage":
                return isAdmin || isFINANCE ? <InnerPage/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;
            case "/finances/AnnualSummaryPage":
                return isAdmin || isFINANCE ? <AnnualSummaryPage/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;
            case "/finances/QuarterlySummaryPage":
                return isAdmin || isFINANCE ? <QuarterlySummaryPage/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;
            case "/admin/empList":
                return isAdmin || isHUMAN_RESOURCE ? <EmployeeAdminPage/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;
            case "/admin/userList":
                return isAdmin || CUSTOMER_SERVICE ? <UserAdminPage/> :
                    <Box sx={{py: 4, textAlign: "center"}}><Typography variant="h4">접근 권한이 없습니다.</Typography></Box>;

            case "/":
                return <Notice/>;
            case "/notice":
                return <Notice/>;
            case "/notice/detail":
                return <NoticeDetailPage/>;
            default:
                return (
                    <Box sx={{py: 4, textAlign: "center"}}>
                        <Typography variant="h4">404 - 페이지를 찾을 수 없습니다.</Typography>
                    </Box>
                );
        }

    }
    else {
        switch (pathname) {
            case "/employee/login":
                return <LoginPage/>;
            case "/employee/logout":
                return <LogoutPage/>;
            case "/employee/signup":
                return <SignupPage/>;
        }
    }

}

// Main Layout Component
export default function DashboardLayoutBasic(props: DemoProps) {
    const { children, window } = props;
    const [pathname, setPathname] = React.useState("/dashboard");
    const demoWindow = window !== undefined ? window() : undefined;
    const { session, setSession } = useSession();
    const [userGrade, setUserGrade] = React.useState<string[]>([]); // 배열로 상태 관리

    // 세션에서 역할 정보 가져오기
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const storedRoles = sessionStorage.getItem("roles");
            if (storedRoles) {
                try {
                    const roles = JSON.parse(storedRoles);
                    setUserGrade(roles); // roles 배열로 설정


                } catch (error) {
                    console.error("Failed to parse roles from sessionStorage", error);
                }
            }
        }
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    const router = React.useMemo<Router>(() => ({
        pathname,
        searchParams: new URLSearchParams(),
        navigate: (path) => setPathname(String(path)), // path를 string으로 변환
    }), [pathname]);


    const NAVIGATION: Navigation = [
        { kind: "header", title: "사원 정보" },
        {
            segment: "employee",
            title: "사원",
            icon: <LockOpen />,
            children: [
                { segment: "signup", title: "회원 가입", icon: <LockOpen /> },
                { segment: "login", title: "로그인", icon: <Login /> },
                { segment: "logout", title: "로그아웃", icon: <Logout /> },
                { segment: "attendance", title: "출퇴근처리", icon: <Logout /> },
                { segment: "leave", title: "휴가", icon: <Logout /> },
                { segment: "list", title: "직원리스트", icon: <Logout /> },
            ],
        },
        { kind: "divider" },
        { kind: "header", title: "물품관리" },
        {
            segment: "products",
            title: "물품관리",
            icon: <Store />,
            children: [
                { segment: "productCreate", title: "물품등록", icon: <Input /> },
                { segment: "index", title: "물품 목록", icon: <ShoppingBag /> },
                { segment: "detail", title: "상세 물품", icon: <ShoppingBag /> },
            ],
        },
        { kind: "divider" },
        { kind: "header", title: "주문관리" },
        { segment: "orders", title: "전체주문", icon: <ShoppingBag /> },
        {
            segment: "orders",
            title: "특정주문",
            icon: <ShoppingBag />,
            children: [
                { segment: "product", title: "물품별 주문", icon: <ShoppingBag /> },
                { segment: "users", title: "유저별 주문", icon: <ShoppingBag /> },
                { segment: "quarter", title: "쿼터별 주문", icon: <ShoppingBag /> },
            ],
        },
        { kind: "divider" },
        { kind: "header", title: "거래처" },
        {
            segment: "partner",
            title: "거래처 관리",
            icon: <ShoppingBag />,
            children: [
                { segment: "create", title: "거래처등록", icon: <ShoppingBag /> },
                { segment: "index", title: "거래처관리", icon: <ShoppingBag /> },
            ],
        },
        { kind: "divider" },
        { kind: "header", title: "재산관리" },
        {
            segment: "finances",
            title: "재산관리",
            icon: <ShoppingBag />,
            children: [
                { segment: "create", title: "재산 등록", icon: <ShoppingBag /> },
                { segment: "innerPage", title: "재산 목록", icon: <ShoppingBag /> },
                { segment: "AnnualSummaryPage", title: "연간 주문 관리", icon: <ShoppingBag /> },
                { segment: "QuarterlySummaryPage", title: "분기별 주문 관리", icon: <ShoppingBag /> },
            ],
        },
        { kind: "divider" },
        { kind: "header", title: "관리자" },
        {
            segment: "admin",
            title: "관리자 관리",
            icon: <ShoppingBag />,
            children: [
                { segment: "empList", title: "직원 관리", icon: <ShoppingBag /> },
                { segment: "userList", title: "유저 관리", icon: <ShoppingBag /> },
            ],
        },
    ];




    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
            branding={{ title: "ERP FRONT" }}
            value={{ session, setSession }}
        >
            <DashboardLayout slots={{ sidebarFooter: SidebarFooter, toolbarActions: UserAccountAndCart }}>
                <DemoPageContent pathname={pathname} session={session} />
            </DashboardLayout>
        </AppProvider>
    );
}
