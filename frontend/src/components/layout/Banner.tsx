"use client"
import {Box} from "@mui/material";
import {useState} from "react";


export default function Banner(){
    const [bannerList, setBannerList] = useState(1);

    // 배경 이미지 리스트
    const backgroundImages = [
        "/banner_test1.png",
        "/banner_test2.png",
        "/banner_test3.png",
    ];

    // 현재 배경 이미지
    const currentBackgroundImage = backgroundImages[bannerList - 1];

    // 배너 리스트 갱신 함수
    const changeBanner = () => {
        setBannerList((prev) => (prev === 3 ? 1 : prev + 1));
    };

    return (
        <Box>
            <Box
                sx={{
                    width: "100%",
                    height: "300px", // 원하는 높이로 설정
                    backgroundImage: `url(${currentBackgroundImage})`,
                    backgroundSize: "cover", // 이미지가 전체 박스를 덮도록 설정
                    backgroundPosition: "center", // 이미지의 중앙을 기준으로 설정
                    display: "flex", // Flexbox 사용
                    justifyContent: "space-between", // 좌우로 배치
                    alignItems: "center", // 세로로 가운데 정렬
                }}
            >
                {/* 좌측 박스 */}
                <Box
                    sx={{
                        width: "20%", // 20% 너비
                        height: "100%",
                        cursor: "pointer",
                        backgroundColor: "rgba(0, 0, 0, 0)", // 투명도 설정 (초기 상태)
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.3)", // 마우스 오버 시 반투명하게
                        },
                    }}
                    onClick={changeBanner}
                ></Box>

                {/* 우측 박스 */}
                <Box
                    sx={{
                        width: "20%", // 20% 너비
                        height: "100%",
                        cursor: "pointer",
                        backgroundColor: "rgba(0, 0, 0, 0)", // 투명도 설정 (초기 상태)
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.3)", // 마우스 오버 시 반투명하게
                        },
                    }}
                    onClick={changeBanner}
                ></Box>
            </Box>
        </Box>
    );
}
