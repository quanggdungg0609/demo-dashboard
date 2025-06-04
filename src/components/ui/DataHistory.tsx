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

/**
 * @component DataHistory
 * @description Displays a paginated table of historical sensor data for a given device.
 * @param {DataHistoryProps} props - The props for the component.
 * @param {string | null} props.deviceId - The ID of the device for which to display historical data. If null, no data is fetched.
 * @returns {JSX.Element} The JSX element containing the data table and pagination controls.
 */
function DataHistory({deviceId}: DataHistoryProps) {
    /**
     * @state {DataHistoryRecord[]} dataHistoryRecords - Stores the historical data records for the current page.
     */
    const [dataHistoryRecords, setDataHistoryRecords] = useState<DataHistoryRecord[]>([]);
    /**
     * @state {number} currentDataHistoryPage - The current page number being displayed in the data history table.
     */
    const [currentDataHistoryPage, setCurrentDataHistoryPage] = useState<number>(1);
    /**
     * @state {number} totalDataHistoryPages - The total number of pages available for the historical data.
     */
    const [totalDataHistoryPages, setTotalDataHistoryPages] = useState<number>(0);
    /**
     * @state {boolean} isLoading - Indicates if the historical data is currently being fetched.
     */
    const [isLoading, setIsLoading] = useState<boolean>(false);
    /**
     * @state {boolean} isError - Indicates if an error occurred while fetching historical data.
     */
    const [isError, setIsError] = useState<boolean>(false);
    
    /**
     * @effect Fetches historical data when the `deviceId` prop changes.
     * @description This effect initiates a fetch for the first page of historical data whenever a new `deviceId` is provided.
     */
    useEffect(() => {
        fetchDataHistory(1);
    },[deviceId]);

    /**
     * @effect Fetches historical data when the `currentDataHistoryPage` state changes.
     * @description This effect is triggered when the user navigates to a different page in the data history table.
     */
    useEffect(() => {
        fetchDataHistory(currentDataHistoryPage);
    },[currentDataHistoryPage])

    /**
     * @function fetchDataHistory
     * @description Asynchronously fetches a specific page of historical data for the `deviceId`.
     * Updates `dataHistoryRecords`, `totalDataHistoryPages`, `currentDataHistoryPage`, `isLoading`, and `isError` states.
     * @param {number} page - The page number to fetch.
     */
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

    /**
     * @function handleDataHistoryPageChange
     * @description Updates the `currentDataHistoryPage` state when the user selects a new page via pagination controls.
     * Ensures the new page number is within valid bounds.
     * @param {number} newPage - The new page number to navigate to.
     */
    const handleDataHistoryPageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalDataHistoryPages) {
          setCurrentDataHistoryPage(newPage);
        }
    };

    /**
     * @function generatePaginationPages
     * @description Generates an array of page numbers and ellipsis placeholders for rendering pagination controls.
     * This helps create a user-friendly pagination interface, especially for a large number of pages.
     * @returns {(number | string)[]} An array representing the pages to be displayed in the pagination component.
     */
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
        // Main container for the data history section
        <div className="h-full bg-gray-50 rounded border border-gray-200 p-4 overflow-auto">
            {/* Conditional rendering based on loading state */}
            {isLoading ? // Loading indicator
                (<div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="mt-2 text-gray-500">Loading data...</p>
                  </div> ) :
                isError ? ( // Error message display
                    <div className="flex flex-col items-center text-red-500">
                        <AlertTriangle className="h-12 w-12" />
                        <p className="text-sm text-gray-500">Please try again or select a different device/data type.</p>
                    </div>
                ): dataHistoryRecords.length > 0 ? ( // Data table and pagination display
                <>
                    {/* Table to display historical data */}
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
                    {/* Pagination controls container */}
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