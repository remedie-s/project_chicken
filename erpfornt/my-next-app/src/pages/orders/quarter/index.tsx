import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { orderList } from "@/api/api";

// API에서 주문 목록을 가져오는 함수
const fetchOrders = async () => {
    const response = await orderList();
    console.log("API Response: ", response);
    return response;
};

// 주어진 날짜를 기준으로 분기를 계산하는 함수
const getQuarter = (dateString: string): number => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateString}`);
        return 0;
    }
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1 필요
    if (month <= 3) return 1;
    if (month <= 6) return 2;
    if (month <= 9) return 3;
    return 4;
};

const OrderTable = (): JSX.Element => {
    const [rows, setRows] = useState<any[]>([]);
    const [filteredRows, setFilteredRows] = useState<any[]>([]);
    const [quarter, setQuarter] = useState<number>(1);
    const [year, setYear] = useState<number>(2024);

    // 주문 목록을 로드하는 useEffect
    useEffect(() => {
        const loadOrders = async () => {
            const data = await fetchOrders();
            const processedData = data.map((order: any) => ({
                id: order.id,
                productName: order.products?.name || "Unknown",
                userName: order.users?.name || "Unknown",
                price: order.price,
                payPrice: order.payPrice,
                quantity: order.quantity,
                createdAt: new Date(order.createdAt).toISOString(),
            }));
            console.log("Processed Rows: ", processedData);
            setRows(processedData);
        };
        loadOrders();
    }, []);

    // 분기와 연도에 맞는 주문 목록을 필터링하는 useEffect
    useEffect(() => {
        const filtered = rows.filter((row) => {
            const orderDate = new Date(row.createdAt);
            const quarterMatch = getQuarter(row.createdAt) === quarter;
            const yearMatch = orderDate.getFullYear() === year;

            // 디버깅을 위한 로그
            console.log(
                `Row: ${JSON.stringify(row)}, Month: ${orderDate.getMonth() + 1}, Quarter Match: ${quarterMatch}, Year Match: ${yearMatch}`
            );

            return quarterMatch && yearMatch;
        });
        console.log("Filtered Rows: ", filtered); // 필터링된 결과 로그
        setFilteredRows(filtered);
    }, [rows, quarter, year]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Order ID', width: 100 },
        { field: 'productName', headerName: 'Product Name', width: 200 },
        { field: 'userName', headerName: 'User Name', width: 150 },
        { field: 'price', headerName: 'Price', width: 100 },
        { field: 'payPrice', headerName: 'Pay Price', width: 120 },
        { field: 'quantity', headerName: 'Quantity', width: 100 },
        { field: 'createdAt', headerName: 'Order Date', width: 180 },
    ];

    // @ts-ignore
    // @ts-ignore
    return (
        <div style={{ height: 600, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                {/* 연도 선택 */}
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ marginRight: 2 }}>
                    {[2023, 2024, 2025].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
                {/* 쿼터 선택 */}
                <select value={quarter} onChange={(e) => setQuarter(Number(e.target.value))}>
                    {[1, 2, 3, 4].map((q) => (
                        <option key={q} value={q}>
                            Q{q}
                        </option>
                    ))}
                </select>
            </div>
            <DataGrid
                rows={filteredRows}
                columns={columns}

            />
        </div>
    );

};

export default OrderTable;
