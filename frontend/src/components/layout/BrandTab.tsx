import {AppBar, Box, Toolbar} from "@mui/material";
import {useRouter} from "next/navigation";

export default function BrandTab() {
    const router = useRouter();

    const brandBox = (name:string) => {
        return (
            <Box sx={{
                color: "#000000",
                width: "10%",
                // Box 사이에 얇은 선 추가
                borderRight: '1px solid #ccc',
                textAlign: "center",
            }}
            onClick={() => router.push(`/brand/${name}`)}
            >
                {name}
            </Box>
        )
    }

    return (
            <AppBar
                position="static"
                sx={{
                    // 그라데이션 색상 설정
                    background: "linear-gradient(to top, #e0e0e0, #ffffff)",
            }}>
                <Toolbar sx={{
                    display: "flex",
                    height: 60,
                    backgroundColor: 'transparent', // 투명 배경
                    padding: 0,
                    margin: 0,
                    alignItems: "center"}}>
                    {brandBox("Bosch")}
                    {brandBox("DeWalt")}
                    {brandBox("ES산업")}
                    {brandBox("계양")}
                    {brandBox("Milwaukee")}
                    {brandBox("Makita")}
                    {brandBox("LS전선")}
                    {brandBox("Hitachi")}
                    {brandBox("Stanley")}
                </Toolbar>
            </AppBar>)
}