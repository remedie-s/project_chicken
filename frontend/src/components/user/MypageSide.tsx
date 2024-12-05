import {Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar} from "@mui/material";
import {useRouter} from "next/navigation";


export default function MypageSide(){
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <Box sx={{ width: "20%", height: "100%", minWidth: "190px", maxWidth: "250px", backgroundColor: "#707070", color: "#FFFFFF" }}>
            <Divider />
            <List>
                <ListItem disablePadding sx={{ margin: 1, display: "flex" }}>
                        <ListItemText primary="마이페이지" sx={{ color: "#FFFFFF" }} />
                </ListItem>
            </List>
            <Divider />
            <List>
                {[
                    { text: "주문 관리", path: "/user/mypage/order" },
                    { text: "내 정보 관리", path: "/user/mypage/profile" },
                    { text: "1:1 문의 내역", path: "/user/mypage/qa" },
                ].map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => handleNavigation(item.path)}>
                            <ListItemText primary={item.text} sx={{ color: "#FFFFFF" }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
