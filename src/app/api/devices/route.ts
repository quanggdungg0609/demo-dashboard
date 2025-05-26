import { NextResponse } from 'next/server';
import {getDataSource } from '../../../../ormconfig';
import { Corrosion } from '@/entity/Corrosion';

export async function GET(request: Request) {
    try {
        const dataSource = await getDataSource();
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
  
        const corrosionRepository = dataSource.getRepository(Corrosion);
        const distinctDevices = await corrosionRepository
            .createQueryBuilder('corrosion')
            .select('DISTINCT corrosion.DEVICE', 'DEVICE')
            .orderBy('corrosion.DEVICE', 'ASC') 
            .getRawMany(); 
        const deviceList = distinctDevices.map(item => item.DEVICE);
        return NextResponse.json({ devices: deviceList });
    }catch(error){
        console.error('Error fetching data:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ message: 'Failed to fetch devices', error: errorMessage }, { status: 500 });
    }
}