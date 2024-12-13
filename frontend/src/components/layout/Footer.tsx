// 사이트 하단 팀명 등

import {Box} from "@mui/material";

export default function Footer() {
    return (
            <Box sx={{
                backgroundColor: "#FFDF00",
                display: "flex",
                width: "100%",
                alignItems: "center",
                flexWrap: "wrap",
                padding: 0,
                position: "relative", // 부모 컨테이너에서 위치 조정이 가능하게 합니다.
                bottom: 0, // 하단에 위치
            }}>
                <Box sx={{
                    width: "40%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexBasis: {xs: '100%', sm: '40%'},
                    textAlign: {xs: 'center', sm: 'left'}
                }}>
                    <h1 style={{fontSize: '1.5rem', margin: 0}}>4C Creators</h1>
                </Box>
                <Box sx={{
                    width: "20%",
                    lineHeight: 0.4,
                    flexBasis: {xs: '100%', sm: '20%'},
                    textAlign: {xs: 'center', sm: 'left'},
                    fontSize: {xs: '0.8rem', sm: '1rem'}
                }}>
                    <p>김재희</p>
                    <p>윤수환</p>
                    <p>이재희</p>
                    <p>황다예</p>
                </Box>
                <Box sx={{
                    width: "100%",
                    flexBasis: {xs: '100%', sm: '30%'},
                    textAlign: {xs: 'center', sm: 'left'},
                    fontSize: {xs: '0.8rem', sm: '1rem'}
                }}>
                    <h3>
                        <a href="https://github.com/remedie-s/project_chicken" target="_blank"
                           rel="noopener noreferrer">https://github.com/remedie-s/project_chicken</a>
                    </h3>
                </Box>
            </Box>
    )
}