"use client";

import { useEffect, useState } from "react";
import authApi from "@/scripts/auth/authApi";
import { UsersDto } from "@/types/userType";

const useAuth = (): { user: UsersDto | null; loading: boolean } => {
    const [user, setUser] = useState<UsersDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await authApi.get<UsersDto>("/users/detail");
                if (res.status === 200) {
                    setUser(res.data);  // 사용자 정보를 상태에 설정
                } else {
                    alert("사용자 정보가 잘못됐습니다. 로그인이 필요합니다.");
                }
            } catch (error) {
                console.error("사용자 정보 가져오기 오류:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};

export default useAuth;
