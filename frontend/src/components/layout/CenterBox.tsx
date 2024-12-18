import {Box, Typography} from "@mui/material";
import React, {ReactNode} from "react";


export default function CenterBox({children, name}:{children:ReactNode, name:string}){
    return(
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%"
        }}>
        <Box sx={{
            width: "90%",
            display: "flex",
            marginTop: 3,
            flexDirection: "column",
                alignItems: "center"}}>
            {name?
            <Typography variant="h5" sx={{marginBottom: 3}}>
                {name}
            </Typography>
                :
                <></>
            }
            <Box sx={{
                width: "90%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 3,
            }}>
            {children}
            </Box>
        </Box>
        </Box>
    )
}