import React, { useEffect, useState } from 'react'


import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DataHistoryProps {
    deviceId: string | null;
}

function DataHistory({deviceId}: DataHistoryProps) {
    const [dataHistoryRecords, setDataHistoryRecords] = useState<DataHistoryRecord[]>([]);
    const [currentDataHistoryPage, setCurrentDataHistoryPage] = useState<number>(1);
    const [totalDataHistoryPages, setTotalDataHistoryPages] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    
    useEffect(() => {
        fetchDataHistory(1);
    },[deviceId]);

    useEffect(() => {
        fetchDataHistory(currentDataHistoryPage);
    },[currentDataHistoryPage])

    const fetchDataHistory = async (page: number) => {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await fetch(`/api/data_history/${deviceId}?page=${page}&limit=10`);
            if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const dataRecords : DataHistoryRecord[] = data.data;
            setDataHistoryRecords(dataRecords);
            setTotalDataHistoryPages(data.totalPages);
            setCurrentDataHistoryPage(data.currentPage);
        } catch (e: any) {
            console.error(e.message);
            setIsError(true);
        }finally {
            setIsLoading(false);
        }
    };

    const handleDataHistoryPageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalDataHistoryPages) {
          setCurrentDataHistoryPage(newPage);
        }
    };

    const generatePaginationPages = () => {
        const pages = [];
        const delta = 1;
        const left = currentDataHistoryPage - delta;
        const right = currentDataHistoryPage + delta;
        
        pages.push(1);

        if (left > 2) {
            pages.push('ellipsis-left');
        }

        for (let i = Math.max(2, left); i <= Math.min(totalDataHistoryPages - 1, right); i++) {
            pages.push(i);
        }

        if (right < totalDataHistoryPages - 1) {
            pages.push('ellipsis-right');
        }

        if (totalDataHistoryPages > 1) {
            pages.push(totalDataHistoryPages);
        }

        return pages;
    };

    return (
        <div className="h-full bg-gray-50 rounded border border-gray-200 p-4 overflow-auto">
            {isLoading ? 
                (<div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="mt-2 text-gray-500">Loading data...</p>
                  </div> ) :
                isError ? (
                    <div className="flex flex-col items-center text-red-500">
                        <AlertTriangle className="h-12 w-12" />
                        <p className="text-sm text-gray-500">Please try again or select a different device/data type.</p>
                    </div>
                ): dataHistoryRecords.length > 0 ? (
                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-2 py-1 text-xs md:px-6 md:py-3">Temp.</th>
                                <th className="px-2 py-1 text-xs md:px-6 md:py-3  sm:table-cell">Humidity</th>
                                <th className="px-2 py-1 text-xs md:px-6 md:py-3">Resistor</th>
                                <th className="px-2 py-1 text-xs md:px-6 md:py-3">Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dataHistoryRecords.map((record) => (
                                <tr key={record.ID}>
                                <td className="px-2 py-1 text-sm md:px-6 md:py-4">{record.TEMPERATURE}°C</td>
                                <td className="px-2 py-1 text-sm md:px-6 md:py-4 sm:table-cell">{record.HUMIDITY}%</td>
                                <td className="px-2 py-1 text-sm md:px-6 md:py-4">{record.RESISTOR.toFixed(5)}</td>
                                <td className="px-2 py-1 text-sm md:px-6 md:py-4">
                                    {record.CALENDAR}
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="w-full mt-4">

                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                <PaginationPrevious 
                                    onClick={() => handleDataHistoryPageChange(currentDataHistoryPage - 1)}
                                    isActive={currentDataHistoryPage > 1}
                                />
                                </PaginationItem>
                                
                                {generatePaginationPages().map((page, index) => {
                                        if (typeof page === 'string') {
                                            return (
                                                <PaginationItem key={`${page}-${index}`}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => handleDataHistoryPageChange(page)}
                                                    isActive={page === currentDataHistoryPage}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                <PaginationItem>
                                    <PaginationNext 
                                        onClick={() => handleDataHistoryPageChange(currentDataHistoryPage + 1)}
                                        isActive={currentDataHistoryPage < totalDataHistoryPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
        ) : (
            <p>Data is empty</p>
        )}
    </div>
  )
}

export default DataHistory