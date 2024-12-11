import { useRouter } from "next/router";
import { logout } from "@/api/api";
import { useEffect } from "react";

const deleteSession = () => {
    console.log("세션을 클리어합니다.");
    sessionStorage.clear();
};

const LogoutPage = () => {
    const router = useRouter();

    useEffect(() => {
        const logoutConsole = async () => {
            try {
                console.log("로그아웃 요청을 합니다.");
                await logout();
                deleteSession();
                setTimeout(() => {
                    console.log("Navigating to main page...");
                    router.push("/loginsuccess");
                }, 3000);
            } catch (error: any) {
                console.error("로그아웃 중 에러가 발생하였습니다.", error);
            }
        };

        logoutConsole();
    }, [router]);

    return <>로그 아웃 요청 중입니다.</>;
};

export default LogoutPage;
