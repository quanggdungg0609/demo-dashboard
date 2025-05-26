import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../../../ormconfig';

import { Corrosion } from '@/entity/Corrosion';
import { formatDateTime } from '@/utils/utils';

export async function GET(
    request: NextRequest,
    { params }: { params: { deviceId: string } }
) {
    try {
      const { deviceId: deviceIdString } = await params;
      if (!deviceIdString) {
        return NextResponse.json({ message: 'Device ID is required' }, { status: 400 });
      }
  
      const deviceId = parseInt(deviceIdString, 10);
      if (isNaN(deviceId)) {
        return NextResponse.json({ message: 'Invalid Device ID format' }, { status: 400 });
      }
  
      const dataSource = await getDataSource();
      const corrosionRepository = dataSource.getRepository(Corrosion);
  
      const latestResistorData = await corrosionRepository.find({
        where: { DEVICE: deviceId },
        select: ['ID', 'DEVICE', 'RESISTOR', 'CALENDAR'],
        order: {
          CALENDAR: 'DESC',
        },
        take: 10,
      });
  
      if (!latestResistorData || latestResistorData.length === 0) {
        return NextResponse.json(
          { message: `No resistor data found for device ${deviceId}` },
          { status: 404 }
        );
      }
      const formattedData: DataRecord[] = latestResistorData.map(record => ({
        VALUE: record.RESISTOR, 
        CALENDAR:  formatDateTime(record.CALENDAR.toLocaleString()),
      }));
  
      return NextResponse.json(formattedData);
    } catch (error) {
      console.error('Error fetching latest resistor data by device:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}