import { AlertTriangle, LineChartIcon, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';



interface GraphProps {
    deviceId: string|null;
}

const dataKeyToLabel: Record<PlottableDataKey, string> = {
    TEMPERATURE: 'Temperature (°C)',
    HUMIDITY: 'Humidity (%)',
    RESISTOR: 'Resistor (Ω)',
};

const graphColors: Record<PlottableDataKey, string> = {
  TEMPERATURE: '#ff7300',
  HUMIDITY: '#00bcd4',
  RESISTOR: '#4caf50'
};

const graphKeyToApiSegment: Record<PlottableDataKey, string> = {
    TEMPERATURE: 'temperature',
    HUMIDITY: 'humidity',
    RESISTOR: 'resistor',
};

/**
 * @component Graph
 * @description Renders a line chart displaying historical sensor data (temperature, humidity, or resistor) for a selected device.
 * Users can switch between different data types to visualize.
 * @param {GraphProps} props - The props for the component.
 * @param {string | null} props.deviceId - The ID of the device for which to display the graph. If null, no data is fetched.
 * @returns {JSX.Element} The JSX element containing the graph and data type selection.
 */
function Graph({ deviceId }: GraphProps) {
    /**
     * @state {PlottableDataKey} selectedGraphKey - The currently selected data type to display on the graph (e.g., 'TEMPERATURE').
     */
    const [selectedGraphKey, setSelectedGraphKey] = useState<PlottableDataKey>('TEMPERATURE');
    /**
     * @state {boolean} loadingGraphData - Indicates if the graph data is currently being fetched.
     */
    const [loadingGraphData, setLoadingGraphData] = useState<boolean>(false);
    /**
     * @state {string | null} errorGraphData - Stores any error message that occurred during graph data fetching.
     */
    const [errorGraphData, setErrorGraphData] = useState<string | null>(null);
    /**
     * @state {DataRecord[]} graphDataRecords - Stores the formatted data records to be plotted on the graph.
     */
    const [graphDataRecords, setGraphDataRecords] = useState<DataRecord[]>([]);

    /**
     * @effect Fetches graph data when the `deviceId` prop changes.
     * @description This effect is responsible for initiating the data fetch for the graph whenever the `deviceId` is updated.
     */
    useEffect(() => {
        fetchGraphData();
    },[deviceId]);
    
    /**
     * @effect Fetches graph data when the `selectedGraphKey` state changes, provided a `deviceId` is selected.
     * @description This effect triggers a new data fetch if the user selects a different data type (e.g., humidity instead of temperature)
     * for the currently selected device. It also clears data and errors if no device is selected.
     */
    useEffect(() => {
        if(deviceId){
            fetchGraphData();
          } else {
            setGraphDataRecords([]);
            setErrorGraphData(null);
            setLoadingGraphData(false);
          }     
    },[selectedGraphKey])

    /**
     * @function fetchGraphData
     * @description Asynchronously fetches and processes data for the graph based on the `selectedGraphKey` and `deviceId`.
     * It updates `graphDataRecords`, `loadingGraphData`, and `errorGraphData` states accordingly.
     * The fetched data is sorted by calendar time and formatted for the chart.
     */
    const fetchGraphData = async () => {
        setLoadingGraphData(true);
        setErrorGraphData(null);
        setGraphDataRecords([]);
        try{
          const apiSegment = graphKeyToApiSegment[selectedGraphKey];
          const endpoint = `/api/${apiSegment}/${deviceId}/latest/`;
          const response = await fetch(endpoint);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          const data: DataRecord[] = await response.json();
          const chartData = [...data]
            .sort((a, b) => new Date(a.CALENDAR).getTime() - new Date(b.CALENDAR).getTime())
            .map(record => ({
              CALENDAR: new Date(record.CALENDAR).toLocaleTimeString([], { day:"2-digit", month:"2-digit", year:"2-digit", hour: '2-digit', minute: '2-digit', second: '2-digit'}),
              VALUE: record.VALUE, 
          }));
          setGraphDataRecords(chartData);
        }catch (e: any) {
          setErrorGraphData(e.message);
        }
        setLoadingGraphData(false);
    }

    return (
        // Main container for the graph section
        <div className="flex flex-col flex-grow h-full bg-gray-50 rounded border border-gray-200 p-4">
            {/* Data type selection radio buttons */}
            <div className="mb-4 flex flex-col md:flex-row gap-2"> 
                <span className="mr-2 font-medium text-blue-700">Select data:</span>
                {(['TEMPERATURE', 'HUMIDITY', 'RESISTOR'] as PlottableDataKey[]).map((key) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="radio"
                      name="graphDataType"

                      value={key}
                      checked={selectedGraphKey === key}
                      onChange={() => setSelectedGraphKey(key)}
                      className="mr-1 accent-blue-600"
                    />
                    <span
                      className='text-gray-700 hover:text-blue-800'
                    >
                      {dataKeyToLabel[key].split(' ')[0]} 
                    </span>
                  </label>
                ))}
            </div>
            {/* Container for ResponsiveContainer, adjusted for loading/error states */}
            <div className="flex-grow flex items-center justify-center" style={{ minHeight: '300px', height: '50vh' }}>
                {/* Loading indicator */}
                {loadingGraphData && (
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="mt-2 text-gray-500">Loading data...</p>
                  </div>
                )}
                {/* Error message display */}
                {!loadingGraphData && errorGraphData && (
                  <div className="flex flex-col items-center text-red-500">
                    <AlertTriangle className="h-12 w-12" />
                    <p className="mt-2">Error: {errorGraphData}</p>
                    <p className="text-sm text-gray-500">Please try again or select a different device/data type.</p>
                  </div>
                )}
                {/* No data available message */}
                {!loadingGraphData && !errorGraphData && graphDataRecords.length === 0 && (
                  <div className="flex flex-col items-center text-gray-500">
                    <LineChartIcon className="h-12 w-12" />
                    <p className="mt-2">No data available to display for the current selection.</p>
                  </div>
                )}
                 {/* Responsive container for the Line Chart */}
                {!loadingGraphData && !errorGraphData && graphDataRecords.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={graphDataRecords}
                      margin={{
                        top: 5,
                        right: 30,
                        left: -20, 
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="CALENDAR" />
                      <YAxis 
                         label={{ 
                          value: typeof window !== 'undefined' && window.innerWidth >= 768 ? dataKeyToLabel[selectedGraphKey] : '',
                          angle: -90, 
                          position: 'insideLeft'
                        }}
                        tickFormatter={(value) => {
                          if (selectedGraphKey === 'RESISTOR') {
                            // Format large resistor values with scientific notation or abbreviated form
                            if (value >= 1000000) {
                              return (value / 1000000).toFixed(1) + 'M';
                            } else if (value >= 1000) {
                              return (value / 1000).toFixed(1) + 'K';
                            } else {
                              return value.toFixed(2);
                            }
                          } else {
                            return value.toFixed(1);
                          }
                        }}
                        width={60}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (selectedGraphKey === 'RESISTOR') {
                            return [typeof value === 'number' ? value.toFixed(5) : value, name];
                          }
                          return [value, name];
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: '10px',
                          textAlign: 'center' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="VALUE" 
                        stroke={graphColors[selectedGraphKey]} 
                        strokeWidth={3}
                        activeDot={{
                          r: 8,
                          fill: graphColors[selectedGraphKey],
                          stroke: graphColors[selectedGraphKey]
                        }} name={dataKeyToLabel[selectedGraphKey]} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
  )
}

export default Graph;