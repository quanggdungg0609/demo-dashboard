import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../../../ormconfig';
import { Corrosion } from '@/entity/Corrosion';
import { formatDateTime } from '@/utils/utils';



export async function GET(
    request: NextRequest,
    { params }: { params: { deviceId: string } }
  ) {
    try {
      const { deviceId } = await params; 
      if (!deviceId) {
        return NextResponse.json({ message: 'Device ID is required' }, { status: 400 });
      }
  
      const dataSource = await getDataSource();
      const corrosionRepository = dataSource.getRepository(Corrosion);
  
      const latestData = await corrosionRepository.find({
        where: { DEVICE: parseInt(deviceId, 10) },
        select: ['TEMPERATURE', 'CALENDAR'],
        order: {
          CALENDAR: 'DESC',
        },
        take: 10,
      });
  
      if (!latestData || latestData.length === 0) {
        return NextResponse.json(
          { message: `No temperature data found for device ${deviceId}` },
          { status: 404 }
        );
      }
  
      const formattedData: DataRecord[] = latestData.map(record => ({
        VALUE: record.TEMPERATURE, 
        CALENDAR:formatDateTime(record.CALENDAR.toLocaleString()),
      }));
  
      return NextResponse.json(formattedData);
    } catch (error) {
      console.error('Error fetching latest temperature data by device:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }