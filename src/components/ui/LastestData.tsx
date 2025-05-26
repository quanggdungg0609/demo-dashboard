
import React, { useEffect, useRef, useState } from 'react'

interface LatestDataProps {
  deviceId: string;
}
function LastestData({ deviceId }: LatestDataProps) {
  const [latestDeviceData, setLatestDeviceData] = useState<LatestCorrosionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [worker, setWorker] = useState<Worker|null>(null);

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
      }
    }
  },[deviceId])

  return (
    <div>
         <h2 className="text-lg font-semibold mb-2">Latest Data for Device {deviceId || 'N/A'}</h2>
        {latestDeviceData && !loading && !error && (
              <p className="text-xs text-gray-500 mb-3">
                Data captured on: {new Date(latestDeviceData.CALENDAR).toLocaleString()}
              </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">Temperature</h3>
            <p className="text-2xl">{latestDeviceData ? `${latestDeviceData.TEMPERATURE}°C` : 'N/A'}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">Humidity</h3>
            <p className="text-2xl">{latestDeviceData ? `${latestDeviceData.HUMIDITY}%` : 'N/A'}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold">Resistor</h3>
              <p className="text-2xl">{latestDeviceData ? `${latestDeviceData.RESISTOR.toFixed(5)} Ω` : 'N/A'}</p>
          </div>
        </div>
    </div>
  )
}

export default LastestData