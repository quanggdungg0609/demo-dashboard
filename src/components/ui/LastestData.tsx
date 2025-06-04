
import React, { useEffect, useRef, useState } from 'react'

interface LatestDataProps {
  deviceId: string;
}

/**
 * @component LastestData
 * @description Displays the latest sensor data (temperature, humidity, resistor) for a given device.
 * It fetches the data initially and then uses a Web Worker to receive real-time updates.
 * @param {LatestDataProps} props - The props for the component.
 * @param {string} props.deviceId - The ID of the device to display data for.
 * @returns {JSX.Element} The JSX element displaying the latest data.
 */
function LastestData({ deviceId }: LatestDataProps) {
  /**
   * @state {LatestCorrosionData | null} latestDeviceData - Stores the latest corrosion data fetched from the API or worker.
   */
  const [latestDeviceData, setLatestDeviceData] = useState<LatestCorrosionData | null>(null);
  /**
   * @state {boolean} loading - Indicates if the initial data fetch is in progress.
   */
  const [loading, setLoading] = useState<boolean>(false);
  /**
   * @state {string | null} error - Stores any error message that occurred during data fetching.
   */
  const [error, setError] = useState<string | null>(null);
  /**
   * @state {Worker | null} worker - Holds the reference to the Web Worker instance for real-time updates.
   */
  const [worker, setWorker] = useState<Worker|null>(null);

  /**
   * @effect Fetches the latest data when the `deviceId` changes and sets up a Web Worker for real-time updates.
   * @description This effect performs an initial fetch for the latest data. It then initializes a Web Worker
   * to listen for subsequent data updates for the specified `deviceId`. It also handles cleanup by terminating
   * the worker when the component unmounts or the `deviceId` changes.
   */
  useEffect(()=>{
    if (deviceId) {
      const fetchLatestData = async () => {
        setLoading(true);
        setError(null);
        setLatestDeviceData(null);
        try {
            const response = await fetch(`/api/latest_data/${deviceId}`);
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data: LatestCorrosionData = await response.json();
            setLatestDeviceData(data);
        } catch (e: any) {
            setError(e.message);
        }
        setLoading(false);
    };
      fetchLatestData();

      if (typeof window !== 'undefined') {
        const newWorker =  new Worker(/* turbopackIgnore: true */"/workers/autoUpdateWorker.js")
        newWorker.onmessage= (e)=>{
          if(e.data.type==="UPDATE"){
            const data: LatestCorrosionData = e.data.payload;
            setLatestDeviceData(data);
          }
        };
        newWorker.onerror = (error) => {
          console.error('Worker error:', error);
        };
        setWorker(newWorker);
        newWorker.postMessage({ deviceId: deviceId });
        return () => {
          newWorker.terminate();
        };
      }  
    } else {
            setLatestDeviceData(null);
            setError(null);
            setLoading(false);
    }
    return ()=>{
      if (worker){
        worker.terminate()
        console.log("Worker terminate")
      }
    }
  },[deviceId])
  console.log(latestDeviceData?.CALENDAR)
  return (
    <div>
         <h2 className="text-lg font-semibold mb-2 text-blue-900">Latest Data for Device {deviceId || 'N/A'}</h2>
        {latestDeviceData && !loading && !error && (
              <p className="text-xs text-gray-500 mb-3">
                Data captured on: {latestDeviceData.CALENDAR}
              </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-row justify-between items-center px-4 py-8 md:justify-start md:items-start md:p-4 md:flex-col  bg-red-300 rounded shadow">
            <h3 className="text-gray-500 text-shadow-2xs text-2xl md:text-xl font-bold">Temperature</h3>
            <p className="text-red-600 text-2xl text-shadow-2xs">{latestDeviceData ? `${latestDeviceData.TEMPERATURE}°C` : 'N/A'}</p>
          </div>
          <div className="flex flex-row justify-between items-center px-4 py-8 md:justify-start md:items-start md:p-4 md:flex-col bg-cyan-300 rounded shadow">
            <h3 className="text-gray-500 text-shadow-2xs text-2xl md:text-xl font-bold">Humidity</h3>
            <p className="text-cyan-600 text-shadow-2xs  text-2xl">{latestDeviceData ? `${latestDeviceData.HUMIDITY}%` : 'N/A'}</p>
          </div>
          <div className="flex flex-row justify-between items-center px-4 py-8 md:justify-start md:items-start md:p-4 md:flex-col bg-green-300 rounded shadow">
              <h3 className="text-gray-500 text-shadow-2xs text-2xl md:text-xl font-bold">Resistor</h3>
              <p className=" text-green-600 text-shadow-2xs text-2xl">{latestDeviceData ? `${latestDeviceData.RESISTOR.toFixed(5)} Ω` : 'N/A'}</p>
          </div>
        </div>
    </div>
  )
}

export default LastestData