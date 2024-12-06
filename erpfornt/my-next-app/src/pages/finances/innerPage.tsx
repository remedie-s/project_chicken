import { getInnerFianceData } from "@/api/api";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function InnerPage() {
    const [innerData, setInnerData] = useState<any[]>([]);

    const fetchInner = async () => {
        const response = await getInnerFianceData();
        console.log("API Response: ", response);

        // 전처리: 필요한 값들에 대한 null/undefined 처리 및 날짜 포맷 설정
        const processedData = response.map((item: any) => ({
            ...item,
            buyPrice: item.buyPrice != null ? `$${item.buyPrice.toLocaleString()}` : '$0',  // 숫자 포맷을 미리 전처리
            currentPrice: item.currentPrice != null ? `$${item.currentPrice.toLocaleString()}` : '$0',  // 숫자 포맷을 미리 전처리
            sellPrice: item.sellPrice != null ? `$${item.sellPrice.toLocaleString()}` : '$0',  // 숫자 포맷을 미리 전처리
            buyTime: item.buyTime ? new Date(item.buyTime).toLocaleString() : 'N/A',  // 날짜 포맷팅, buyTime이 없으면 'N/A'
            sellTime: item.sellTime ? new Date(item.sellTime).toLocaleString() : '보유중',  // sellTime이 없으면 '보유중'
        }));

        setInnerData(processedData);
    };

    useEffect(() => {
        fetchInner();
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Asset Name', width: 150 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'buyPrice', headerName: 'Buy Price', width: 150 },
        { field: 'currentPrice', headerName: 'Current Price', width: 150 },
        { field: 'sellPrice', headerName: 'Sell Price', width: 150 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'buyTime', headerName: 'Buy Time', width: 200 },
        { field: 'sellTime', headerName: 'Sell Time', width: 200 },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={innerData}  // Ensure the rows data is correctly passed here
                columns={columns}

            />
        </div>
    );
}
