"use client"
import React, {useState, useMemo} from 'react';
import {useTable, useSortBy, usePagination, Column, TableState, TableInstance, Row} from 'react-table';
import {Grid, Button, Typography, Card, CardContent, CardMedia, Box, Grid2} from '@mui/material';
import {ProductsDto} from '@/types/productType';
import {useRouter} from "next/navigation";
import gradeDiscountPrice from "@/scripts/GradeDiscountPrice";

// React Table State 타입 확장
interface TableStateWithPagination<T extends object> extends Partial<TableState<T>> {
    pageIndex: number;
    pageSize: number;
}

// TableInstance 확장 타입
type TableInstanceWithPagination<T extends object> = TableInstance<T> & {
    state: TableStateWithPagination<T>;
    page: Array<Row<T>>;
    canPreviousPage: boolean;
    canNextPage: boolean;
    gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
    nextPage: () => void;
    previousPage: () => void;
    pageOptions: number[];
};

type productsType = {
    products: ProductsDto[];
};

export default function ProductList({ products }: productsType) {
    const [sortType, setSortType] = useState<"price" | "createdAt" | "sellCount">("createdAt");
    const [priceSortOrder, setPriceSortOrder] = useState<'asc' | 'desc'>('asc');
    const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sellSortOrder, setSellSortOrder] = useState<'asc' | 'desc'>('asc');
    const router = useRouter();

    // 정렬된 상품 리스트
    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            // 가격순 정렬 및 역순
            if (sortType === "price") {
                return priceSortOrder === "asc" ? a.price - b.price : b.price - a.price;
            }
            // 출시일순 정렬 및 역순
            else if (sortType === "createdAt") {
                return dateSortOrder === "asc"
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            // 판매량순 정렬 및 역순
            return sellSortOrder === "asc" ? a.sellCount - b.sellCount : b.sellCount - a.sellCount
        });
    }, [sortType, priceSortOrder, dateSortOrder, sellSortOrder]);

    const togglePriceSortOrder = () => {
        setPriceSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
        setSortType('price');
    };

    const toggleDateSortOrder = () => {
        setDateSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
        setSortType('createdAt');
    };
    const toggleSellSortOrder = () => {
        setSellSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
        setSortType('sellCount');
    };

    // useTable과 usePagination 결합 후 타입 확장
    const columns: Column<ProductsDto>[] = useMemo(
        () => [
            {Header: '상품명', accessor: 'name'},
            {Header: '가격', accessor: 'price'},
            {Header: '출시일', accessor: 'createdAt'},
            {Header: '판매량', accessor: 'sellCount'},
        ],
        []
    );

    const instance = useTable<ProductsDto>(
        {
            columns,
            data: sortedProducts,
            // 첫 페이지 번호, 페이지마다 몇 개 나올지
            initialState: {pageIndex: 0, pageSize: 8} as TableStateWithPagination<ProductsDto>,
        },
        useSortBy,
        usePagination
    ) as TableInstanceWithPagination<ProductsDto>;

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        state: {pageIndex, pageSize},
    } = instance;

    return (
        <Box sx={{alignItems: 'center', justifyItems: 'center'}}>
            {/* 정렬 버튼 */}
            <Button onClick={toggleDateSortOrder} sx={{color: "#000000"}}>
                {dateSortOrder === "asc" ? "출시일순 ▼" : "출시일순 ▲"}
            </Button>
            <Button onClick={togglePriceSortOrder} sx={{color: "#000000"}}>
                {priceSortOrder === "asc" ? "가격순 ▼" : "가격순 ▲"}
            </Button>
            <Button onClick={toggleSellSortOrder} sx={{color: "#000000"}}>
                {sellSortOrder === "asc" ? "판매량순 ▼" : "판매량순 ▲"}
            </Button>
            {/*상품 리스트 출력*/}
            <Box>
            <Grid2 container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
                {page.map((row) => {
                    prepareRow(row);
                    return (
                        <Grid2
                            key={row.original.id}
                            size={{ xs: 4, sm: 4, md: 3 }}
                        >
                            <Card onClick={() => {
                                router.push(`/product/detail/${row.original.id}`)
                            }}
                                  sx={{ width: '100%', minWidth: 250 }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={row.original.imageUrl}
                                    alt={row.original.name}
                                    // 이미지 크기 조절
                                    style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{row.original.name}</Typography>
                                    {row.original.stock>0?
                                    <Typography variant="body2" color="text.secondary">
                                        ₩{row.original.price} - {row.original.sellCount} 판매됨
                                        <br/>
                                        현재 가격 : ₩{gradeDiscountPrice(row.original.price)}
                                    </Typography>
                                        :
                                        <Typography>
                                            재고 부족
                                        </Typography>
                                    }
                                </CardContent>
                            </Card>
                        </Grid2>
                    );
                })}
            </Grid2>
            </Box>
            {/* 페이지 네비게이션 버튼 */}
            <Box>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
            </Button>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
            </Button>
            <Button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
                {'>>'}
            </Button>
            <Typography variant="body2" style={{marginTop: "10px"}} align="center">
                {`${pageIndex + 1} 페이지`}
                <br/>
                {`총 ${pageOptions.length} 페이지`}
            </Typography>
            </Box>
        </Box>
    );
};
