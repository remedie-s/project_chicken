"use client"
import React, { useState } from "react";
const FAQList = () => {
    // 질문과 답변 데이터
    const questions = [
        { no: 1, Fquestion: "환불은 얼마나 걸리나요?",
                 Fanswer: "💛환불은 결제수단에 따라 영업일 기준 3-5일이 소요됩니다.\n" +
                          "\n" +
                          "🧡무통장 결제의 환불금액은 접수일 기준 다음날 처리 됩니다.\n" +
                          "\n" +
                          "📌무통장 입금거래로 취소/반품시 환불계좌는 원칙적으로 입금해주셨던 계좌로 환불되는점 참고바랍니다." },
        { no: 2, Fquestion: "택배사 및 배송은 언제되나요?",
                 Fanswer: "🚛 평일 오후 4시 이전 당일배송 카테고리내 제품으로 주문 결제 완료 시, 대한통운 택배로 당일 출고됩니다.\n" +
                          "\n" +
                          "     단, 협력사 상품과 합주문 또는 결제순 배송으로 인해 재고 소진시 품절안내 또는 배송이 지연될 수 있습니다.\n" +
                          "\n" +
                          "😥 협력사 상품 주문의 경우 보통 3-4일의 상품 준비 기간이 소요되며 지연시 알림톡 또는 문자로 안내드립니다.\n" +
                          "\n" +
                          "     최대한 빠르게 보내드리기 위해 준비순 부분적으로 발송이 진행될 수 있습니다. " },
        { no: 3, Fquestion: "교환/반품하는데 얼마나 걸릴까요?",
                 Fanswer: "💛접수일로부터 총 소요 시간은 영업일 기준 6-10일 정도입니다.\n" +
                          "\n" +
                          "🧡반품 신청일 기준 2일 이내 회수 ➡ 3일 이내 물류센터로 도착 ➡ 입고 일로부터 영업일 기준 1-5일 이내 처리 \n" +
                          "\n" +
                          "📌회수가 지연될 경우 처리가 더욱 늦어질 수 있으니 회수지연 시 꼭 고객센터로 반품 재접수 문의 부탁드립니다." },
        { no:4,  Fquestion: "고객센터 상담 시간은 언제인가요?",
                 Fanswer: "📩고객센터 운영시간 : 오전 09:00 ~ 오후 06:00\n" +
                          "\n" +
                          "🌜점심시간 : 오후 12:30 ~ 오후 13:30 \n" +
                          "\n" +
                          "🌜휴 무 : 토요일, 일요일, 공휴일"},
        { no:5, Fquestion: "택배비는 얼마인가요?",
                Fanswer:  "💳편도 배송비는 3,000원입니다.\n" +
                          "\n" +
                          "💚교환 : 반품 수거, 재발송 총 6,000원 \n" +
                          "\n" +
                          "💙전체 반품 : 최초 배송비, 수거비 총 6,000원 \n" +
                          "\n" +
                          "💜부분 반품 : 반품 수거비 3,000원 \n" +
                          "\n" +
                          "(단, 반품 후 총결제 금액 5만 원 미만일 경우 최초 배송비가 발생됩니다.) \n" +
                          "\n" +
                          "📌제주도 및 도서산간 지역은 추가 배송료가 부가될 수 있습니다."}
    ];

    // 열리고 닫힘 상태를 관리하기 위한 상태값
    const [openQuestionId, setOpenQuestionId] = useState(null);

    // 질문 클릭 시 상태 변경 함수
    const toggleAnswer = (no) => {
        setOpenQuestionId((prevId) => (prevId === no ? null : no));
    };

    return (
        <div style={{ padding: "20px"}}>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {questions.map((item) => (
                    <li key={item.no} style={{ marginBottom: "20px" }}>
                        <button
                            onClick={() => toggleAnswer(item.no)}
                            style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "10px",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                        >
                            {item.no} . {item.Fquestion}
                        </button>
                        {openQuestionId === item.no && (
                            <p
                                style={{
                                    marginTop: "10px",
                                    padding: "10px",
                                    backgroundColor: "#f1f1f1",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                }}
                            >
                                {item.Fanswer.split("\n").map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FAQList;
