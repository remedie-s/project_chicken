import Router from "next/router";
import {
    logout
} from "@/api/api";
import { useEffect } from "react";
import {router} from "next/client";

const deleteSession = () => {
    console.log("세션을 클리어합니다.")
    sessionStorage.clear();
}
const LogoutPage =  ()=>{

    useEffect(()=>{

        const logoutConsole = async()=>{
            try{
                console.log("로그아웃 요청을 합니다.")
                await logout();
                deleteSession();
                setTimeout(() => {
                    console.log('Navigating to main page...');
                    if (typeof window !== 'undefined') {
                        router.push('/loginsuccess');
                    }
                }, 3000);

            }
            catch(error:any){
                console.error("로그아웃중 에러가 발생하였습니다.")
            }
        };

        logoutConsole();

    },[])


    return (
        <>
            로그 아웃 요청중입니다.
        </>
    )
}

export default LogoutPage;