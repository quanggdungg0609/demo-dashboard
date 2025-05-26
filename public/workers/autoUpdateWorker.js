
let intervalId;

const fetchData = async (deviceId)=>{
    try{
        const response = await fetch(`/api/latest_data/${deviceId}`);
        if(!response.ok){
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        self.postMessage({ type: 'UPDATE', payload: data });
    }catch(error){
        console.error('Error fetching data:', error);
        self.postMessage({ type: 'ERROR', error: error.message });
    }
}

self.onmessage=(event)=>{
    const deviceId = event.data.deviceId    
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
        fetchData(deviceId);
    }, 10 * 1000);
}

self.onclose = () => {
    clearInterval(intervalId);
};