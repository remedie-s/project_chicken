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
import LoginPage from "@/pages/login";
import LogoutPage from "../pages/logout";
import SignupPage from "../pages/signup";
import AttendancePage from "@/pages/attendance/index";
import ProductCreatePage from "@/pages/products/create";
import LeavePage from "@/pages/leave/index";
import OrdersPage from "@/pages/orders/index";

// 타입 정의
import type { DemoProps, IPage } from "@/api/datatype";
import type { Navigation, Router } from "@toolpad/core";
import ProductList from "@/pages/products/productList";
import Leave from "@/pages/leave/index";
import Notice from "@/pages/notice";

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
    const [session, setSession] = React.useState<{ user: { name: string | null; email: string | null } } | null>(null);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const email = sessionStorage.getItem("email");
            const name = sessionStorage.getItem("name");

            if (email && name) {
                setSession({ user: { name, email } });
            }
        }
    }, []);

    return { session, setSession };
}

// SidebarFooter Component
function SidebarFooter({ mini }: SidebarFooterProps) {
    return (
        <Typography variant="caption" sx={{ m: 1, whiteSpace: "nowrap", fontSize: "1.0em" }}>
            {mini ? "© MUI" : `© ${new Date().getFullYear()} Made with love by Jaehee Kim`}
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
                <Typography variant="h6" onClick={() => router.push("/login")}>
                    먼저, 로그인을 해주세요. 미 로그인시 사이트 접속이 제한됩니다.
                </Typography>
            )}
        </>
    );
}

// DemoPageContent Component
function DemoPageContent({ pathname, session }: IPage) {
    switch (pathname) {
        case "/login":
            return <LoginPage />;
        case "/logout":
            return <LogoutPage />;
        case "/signup":
            return <SignupPage />;
        case "/attendance":
            return <AttendancePage />;
        case "/productCreate":
            return <ProductCreatePage />;
        case "/products":
            return <ProductList />;
        case "/leave":
            return <LeavePage />;

        case "/orders":
            return <OrdersPage />;
        case "/dashboard":
            return <Notice />;
        default:
            return (
                <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography variant="h4">404 - 페이지를 찾을 수 없습니다.</Typography>
                </Box>
            );
    }
}

// Main Layout Component
export default function DashboardLayoutBasic(props: DemoProps) {
    const { children, window } = props;
    const [pathname, setPathname] = React.useState("/dashboard");
    const demoWindow = window !== undefined ? window() : undefined;
    const { session, setSession } = useSession();
    const [userGrade, setUserGrade] = React.useState<string>("0");

    const router = React.useMemo<Router>(() => ({
        pathname,
        searchParams: new URLSearchParams(),
        navigate: (path) => setPathname(String(path)), // path를 string으로 변환
    }), [pathname]);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            // 클라이언트에서만 sessionStorage 접근
            const storedUserGrade = sessionStorage.getItem("userGrade") || "0";
            setUserGrade(storedUserGrade);
        }
    }, []);

    const NAVIGATION: Navigation = [
        { kind: "header", title: "로그인 정보" },
        { segment: "signup", title: "회원 가입", icon: <LockOpen /> },
        { segment: "login", title: "로그인", icon: <Login /> },
        { segment: "logout", title: "로그아웃", icon: <Logout /> },
        { segment: "attendance", title: "출퇴근처리", icon: <Logout /> },
        { segment: "leave", title: "휴가", icon: <Logout /> },
        { kind: "divider" },
        { kind: "header", title: "판매 물품" },
        ...(userGrade !== "99" ? [{ segment: "productCreate", title: "물품등록", icon: <Input /> }] : []),
        { segment: "products", title: "판매 물품", icon: <Store /> },
        { kind: "divider" },
        { kind: "header", title: "주문관리" },
        { segment: "orders", title: "주문", icon: <ShoppingBag /> },
        ...(userGrade === "0" ? [{ segment: "ordersAdmin", title: "주문관리", icon: <ShoppingBag /> }] : []),
    ];

    React.useEffect(() => {
        if (typeof window !== "undefined" && !session) {
            router.navigate("/login");
        }
    }, [router, session]);

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
