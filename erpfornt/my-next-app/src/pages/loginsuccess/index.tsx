'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {useFCM} from "@/hooks/useFCM";

const LoginSuccess = () => {
    const router = useRouter();
    useFCM();
    useEffect(() => {

        router.push('/');
    }, [router]);

    return null; // 화면에 아무것도 표시하지 않음
};

export default LoginSuccess;
