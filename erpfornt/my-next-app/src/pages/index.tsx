import { useRouter } from 'next/navigation';
import {useEffect} from "react";
const pure = ()=>{
    const router = useRouter();

    useEffect(() => {
        router.push('/main');
    }, [router]);

    return null; // 화면에 아무것도 표시하지 않음
}
export default pure;