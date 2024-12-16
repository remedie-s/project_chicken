import {Box} from "@mui/material";
import {ReactNode} from "react";


export default function ({children}:{children:ReactNode}){
    return(
        <Box sx={{display: "flex", justifyContent: "center", marginTop: 3}}>
            {children}
        </Box>
    )
}