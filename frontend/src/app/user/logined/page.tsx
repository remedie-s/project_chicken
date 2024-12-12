"use client"
import {useFCM} from "@/hooks/useFcm";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function (){
    useFCM();
    const router = useRouter();

    useEffect(() => {
        // 홈으로 날라감
        router.replace('/');
    }, [router]);
    return(
        <>
            페이지 이동 중
        </>
    )
}