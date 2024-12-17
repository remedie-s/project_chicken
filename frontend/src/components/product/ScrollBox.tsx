import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Box} from "@mui/material";

const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({behavior: 'smooth'});
    }
};

const ScrollBox = ({name, id}: { name: string, id: string }) => {
    const [bgColor, setBgColor] = useState("#000000");
    const router = useRouter();

    const handleMouseOver = () => {
        setBgColor("#707070");
    };

    const handleMouseOut = () => {
        setBgColor("#000000");
    };


    return (
        <Box sx={{
            color: "#FFFFFF",
            width: "10%",
            height: "100%",
            borderRight: '1px solid #ccc',
            bgcolor: bgColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}
             onClick={() => scrollTo(id)}
             onMouseOver={handleMouseOver}
             onMouseOut={handleMouseOut}
        >
            {name}
        </Box>
    );
};

export default ScrollBox;