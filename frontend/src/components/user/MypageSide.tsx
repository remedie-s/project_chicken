import {Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar} from "@mui/material";

type setMypageContentType = {
    setMypageContent: (content: number) => void;
}

export default function MypageSide({setMypageContent}: setMypageContentType){
    const dummy = {

    }
    return (
        <Box sx={{width: "20%", height:"100%", minWidth: "190px", maxWidth: "250px",
            backgroundColor: "#707070", color: "#FFFFFF"}}>
                <Divider/>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setMypageContent(1)}>
                            마이페이지
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    {["주문 관리", "내 정보 관리", "1:1 문의 내역"].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => setMypageContent(index + 1)}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
        </Box>)
}