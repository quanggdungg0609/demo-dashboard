import { NextRequest, NextResponse } from "next/server";
import { Corrosion } from "@/entity/Corrosion";
import { getDataSource } from "../../../../../ormconfig";
import { formatDateTime } from "@/utils/utils";

export async function GET(
    request: NextRequest,
    { params }: { params: { deviceId: string } }
) {
    try{
        const { deviceId } = await params;
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1',10);
        const limit = parseInt(searchParams.get('limit') || '5',10);
        const skip = (page - 1) * limit;
        if(!deviceId){
            return NextResponse.json({ message: 'Device ID is required' }, { status: 400 });
        }
        const dataSource = await getDataSource();
        const corrosionRepository = dataSource.getRepository(Corrosion);
        const [corrosion, total] = await corrosionRepository.findAndCount({
            where: {
                DEVICE:  parseInt(deviceId, 10)
            },
            select:{
                ID: true,
                TEMPERATURE: true,
                HUMIDITY: true,
                RESISTOR: true,
                CALENDAR: true,
            },
            order:{
                CALENDAR: 'DESC'
            },
            skip: skip,
            take: limit,
        });
        if(!corrosion || corrosion.length === 0){
            return NextResponse.json(
                { message: `No temperature data found for device ${deviceId}` },
                { status: 404 }
            );
        }

        const formattedCorrosion = corrosion.map((corrosion) => ({
            ID: corrosion.ID,
            TEMPERATURE: corrosion.TEMPERATURE,
            HUMIDITY: corrosion.HUMIDITY,
            RESISTOR: corrosion.RESISTOR,
            CALENDAR: formatDateTime(corrosion.CALENDAR.toLocaleString()),
        }));
        return NextResponse.json({
            data: formattedCorrosion,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit: limit,
        });
    }catch (error) {
        console.error('Error fetching temperature history data by device:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
    
}