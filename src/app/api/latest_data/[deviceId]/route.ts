import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../../ormconfig';
import { Corrosion } from '@/entity/Corrosion';
import { formatDateTime } from '@/utils/utils';


interface Params {
    deviceId: string;
}

export async function GET(request: Request, { params }: { params: Promise<{ deviceId: string }> }) {
    const { deviceId } = await params;
    if (!deviceId) {
      return NextResponse.json({ message: 'deviceId is required' }, { status: 400 });
    }
    if (!deviceId) {
      return NextResponse.json({ message: 'Device ID is required' }, { status: 400 });
    }
  
    const numericDeviceId = parseInt(deviceId, 10);
    if (isNaN(numericDeviceId)) {
      return NextResponse.json({ message: 'Invalid Device ID format' }, { status: 400 });
    }
  
    try {
      const dataSource = await getDataSource();
      const corrosionRepository = dataSource.getRepository(Corrosion);
  
      const latestRecord = await corrosionRepository.findOne({
        where: { DEVICE: numericDeviceId },
        order: { CALENDAR: 'DESC' },
      });
  
      if (!latestRecord) {
        return NextResponse.json({ message: 'No data found for this device' }, { status: 404 });
      }
  
      const result = {
        DEVICE: latestRecord.DEVICE,
        HUMIDITY: latestRecord.HUMIDITY,
        TEMPERATURE: latestRecord.TEMPERATURE,
        RESISTOR: latestRecord.RESISTOR,
        CALENDAR: formatDateTime(latestRecord.CALENDAR.toLocaleString()),
      };
  
      return NextResponse.json(result);
  
    } catch (error) {
      console.error('Failed to fetch latest reading for device:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return NextResponse.json({ message: 'Failed to fetch data', error: errorMessage }, { status: 500 });
    }
  }
