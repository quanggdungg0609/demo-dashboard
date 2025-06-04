import { NextRequest, NextResponse } from "next/server";
import { Corrosion } from "@/entity/Corrosion";
import { getDataSource } from "../../../../../ormconfig";
import { formatDateTime } from "@/utils/utils";
/* eslint-disable */

/**
 * @swagger
 * /api/data_history/{deviceId}:
 *   get:
 *     summary: Retrieve historical corrosion data for a specific device with pagination.
 *     description: Fetches a paginated list of historical corrosion data (temperature, humidity, resistor, and calendar date) for a given device ID.
 *     tags:
 *       - Data History
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         description: The ID of the device to fetch data for.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of items per page (default is 5).
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: A list of historical corrosion data for the device.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID:
 *                         type: integer
 *                         example: 1
 *                       TEMPERATURE:
 *                         type: number
 *                         format: float
 *                         example: 25.5
 *                       HUMIDITY:
 *                         type: number
 *                         format: float
 *                         example: 60.2
 *                       RESISTOR:
 *                         type: number
 *                         format: float
 *                         example: 1000.0
 *                       CALENDAR:
 *                         type: string
 *                         example: "2023-10-27 10:30:00"
 *                 totalItems:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 20
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Bad Request - Device ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Device ID is required"
 *       404:
 *         description: Not Found - No data found for the specified device ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No temperature data found for device {deviceId}"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ deviceId: string }> }  
) {
    try{
        
        const  {deviceId }  = await context.params;
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