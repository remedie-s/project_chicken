import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { orderList } from "@/api/api";  // 주문 데이터를 가져오는 API 함수

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const fetchOrders = async () => {
    const response = await orderList();
    return response;
};

const AnnualSummaryPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [year, setYear] = useState<number>(2024);
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: `Total Orders in ${year}`,
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }
        ]
    });

    useEffect(() => {
        const loadOrders = async () => {
            const data = await fetchOrders();
            setOrders(data);
        };
        loadOrders();
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            // 연도별 월별 데이터 계산
            const months = Array.from({ length: 12 }, (_, i) => i + 1);
            const monthlyData = months.map((month) => {
                const filteredOrders = orders.filter((order) => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate.getFullYear() === year && orderDate.getMonth() + 1 === month;
                });

                const totalPrice = filteredOrders.reduce((sum, order) => sum + order.price, 0);  // 가격 총합
                const totalDiscount = filteredOrders.reduce((sum, order) => sum + order.discount, 0);  // 할인 총합
                const totalAmount = filteredOrders.reduce((sum, order) => sum + order.payPrice, 0);  // 결제 금액 총합

                return { totalPrice, totalDiscount, totalAmount };
            });

            setChartData({
                labels: months.map((month) => `Month ${month}`),
                datasets: [
                    {
                        label: `Total Price in ${year}`,
                        data: monthlyData.map(data => data.totalPrice),
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    },
                    {
                        label: `Total Discount in ${year}`,
                        data: monthlyData.map(data => data.totalDiscount),
                        fill: false,
                        borderColor: 'rgb(255, 99, 132)',  // 할인은 다른 색으로 표시
                        tension: 0.1,
                    },
                    {
                        label: `Total PayPrice in ${year}`,
                        data: monthlyData.map(data => data.totalAmount),
                        fill: false,
                        borderColor: 'rgb(54, 162, 235)',  // 결제 금액은 다른 색으로 표시
                        tension: 0.1,
                    }
                ],
            });
        }
    }, [orders, year]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {[2023, 2024, 2025].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
            <Line data={chartData} />
        </div>
    );
};

export default AnnualSummaryPage;
