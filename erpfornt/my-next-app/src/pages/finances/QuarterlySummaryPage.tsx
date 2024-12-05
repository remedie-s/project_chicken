import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { orderList } from "@/api/api";  // 주문 데이터를 가져오는 API 함수

const fetchOrders = async () => {
    const response = await orderList();
    return response;
};

const QuarterlySummaryPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [year, setYear] = useState<number>(2024);
    const [quarterData, setQuarterData] = useState<any[]>([]);

    useEffect(() => {
        const loadOrders = async () => {
            const data = await fetchOrders();
            setOrders(data);
        };
        loadOrders();
    }, []);

    useEffect(() => {
        const data = [1, 2, 3, 4].map((quarter) => {
            const filteredOrders = orders.filter((order) => {
                const orderDate = new Date(order.createdAt);
                return (
                    orderDate.getFullYear() === year &&
                    Math.ceil((orderDate.getMonth() + 1) / 3) === quarter
                );
            });

            const totalPrice = filteredOrders.reduce((sum, order) => sum + order.price, 0);
            const totalDiscount = filteredOrders.reduce((sum, order) => sum + order.discount, 0);
            const totalPayPrice = filteredOrders.reduce((sum, order) => sum + order.payPrice, 0);
            const totalOrders = filteredOrders.length;

            return {
                id: `Q${quarter}`,
                quarter: `Q${quarter}`,
                totalPrice,
                totalDiscount,
                totalPayPrice,
                totalOrders,
            };
        });
        setQuarterData(data);
    }, [orders, year]);

    const columns: GridColDef[] = [
        { field: 'quarter', headerName: 'Quarter', width: 150 },
        { field: 'totalPrice', headerName: 'Total Price', width: 150 },
        { field: 'totalDiscount', headerName: 'Total Discount', width: 150 },
        { field: 'totalPayPrice', headerName: 'Total Pay Price', width: 150 },
        { field: 'totalOrders', headerName: 'Total Orders', width: 150 },
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {[2023, 2024, 2025].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
            <DataGrid
                rows={quarterData as GridRowsProp} // Explicitly type the rows
                columns={columns}

            />
        </div>
    );
};

export default QuarterlySummaryPage;
