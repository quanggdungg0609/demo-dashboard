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

interface DataHistoryProps {
    deviceId: string | null;
}

function DataHistory({deviceId}: DataHistoryProps) {
    const [dataHistoryRecords, setDataHistoryRecords] = useState<DataHistoryRecord[]>([]);
    const [currentDataHistoryPage, setCurrentDataHistoryPage] = useState<number>(1);
    const [totalDataHistoryPages, setTotalDataHistoryPages] = useState<number>(0);

    useEffect(() => {
        fetchDataHistory(1);
    },[deviceId]);

    useEffect(() => {
        fetchDataHistory(currentDataHistoryPage);
    },[currentDataHistoryPage])

    const fetchDataHistory = async (page: number) => {
        try {
            const response = await fetch(`/api/data_history/${deviceId}?page=${page}&limit=5`);
            if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            const dataRecords : DataHistoryRecord[] = data.data;
            setDataHistoryRecords(dataRecords);
            setTotalDataHistoryPages(data.totalPages);
            setCurrentDataHistoryPage(data.currentPage);
        } catch (e: any) {
            console.error(e.message);
        }
    };

    const handleDataHistoryPageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalDataHistoryPages) {
          console.log(newPage);
          setCurrentDataHistoryPage(newPage);
        }
    };

    return (
        <div className="h-full bg-gray-50 rounded border border-gray-200 p-4 overflow-auto">
            {dataHistoryRecords.length > 0 ? (
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
                    <div className="mt-4">

                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                <PaginationPrevious 
                                    onClick={() => handleDataHistoryPageChange(currentDataHistoryPage - 1)}
                                    isActive={currentDataHistoryPage > 1}
                                />
                                </PaginationItem>
                                
                                {Array.from({ length: totalDataHistoryPages }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                        onClick={() => handleDataHistoryPageChange(page)}
                                        isActive={page === currentDataHistoryPage}
                                        >
                                        {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

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