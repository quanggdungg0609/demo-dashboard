"use client"
import { useState, useEffect } from "react"; 
import { Loader2, AlertTriangle, LineChart as LineChartIcon } from 'lucide-react'; // Thêm các icon cần thiết


import LastestData from "@/components/ui/LastestData";
import Graph from "@/components/ui/Graph";
import DataHistory from "@/components/ui/DataHistory";






export default function Home() {
  const [devicesList, setDevicesList] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);




  

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const response = await fetch("/api/devices")
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data.devices);
        setDevicesList(data.devices);
        setSelectedDevice(data.devices[0]);
      }catch(error){
        console.error("Error fetching data: ", error);
      }
    }; 
    fetchData();
  },[]);

  

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-100" 
    >
      <section
        id="select-device-section"
        className="p-4 bg-white shadow-md" 
      >
        <h2 className="text-lg font-semibold mb-2">Select device:</h2>
        <select className="w-full p-2 border rounded"
          value={selectedDevice || ''}
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          {
            devicesList.map((device, index) => (
              <option key={index} value={device}>
                {device}
              </option>
            ))
          }
        </select>
      </section>
      <section
        id="last-data-section"
        className="p-4 mt-4"
      >
        <LastestData deviceId={selectedDevice || ''}/>
      </section>
      <section
        id="graph-and-history-section"
        className="p-4 mt-4 flex-grow flex flex-col bg-white shadow-md rounded-t-lg" 
      >
        <h2 className="text-lg font-semibold mb-2">Graph and History</h2>
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab(0)}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 0
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Graph
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 1
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Data history
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-grow mt-4 flex flex-col"> 
          {activeTab === 0 && selectedDevice && (
            <Graph deviceId={selectedDevice}/>
          )}
          {activeTab === 1 && (
            <DataHistory deviceId={selectedDevice}/>
          )}
        </div>
      </section>
    </div>
  );
}
