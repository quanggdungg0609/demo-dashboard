interface DataRecord {
    VALUE: number;
    CALENDAR: string;
}

interface DataHistoryRecord{
    ID:number;
    TEMPERATURE:number;
    HUMIDITY:number;
    RESISTOR:number;
    CALENDAR:string;
}

interface LatestCorrosionData {
    DEVICE: string;
    TEMPERATURE: number;
    HUMIDITY: number;
    RESISTOR: number;
    CALENDAR: string;
}

type PlottableDataKey = 'TEMPERATURE' | 'HUMIDITY' | 'RESISTOR';



