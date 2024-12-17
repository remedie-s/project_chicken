import {Box} from "@mui/material";
import {ReactNode} from "react";


export default function CenterBox({children}:{children:ReactNode}){
    return(
        <Box
            sx={{display: "flex",
            justifyContent: "center"}}>
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 3,
            width: "90%",
            flexDirection: "column"}}>
            {children}
        </Box>
        </Box>
    )
}