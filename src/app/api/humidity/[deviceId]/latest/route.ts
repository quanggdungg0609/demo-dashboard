import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "../../../../../../ormconfig";
import { Corrosion } from "@/entity/Corrosion";
import { formatDateTime } from "@/utils/utils";


/**
 * @swagger
 * /api/humidity/{deviceId}/latest:
 *   get:
 *     summary: Retrieve the latest humidity data for a specific device.
 *     tags:
 *       - Humidity
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the device to fetch humidity data for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest humidity data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   VALUE:
 *                     type: number
 *                     description: The humidity value.
 *                   CALENDAR:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the data recording.
 *               example:
 *                 - VALUE: 75.2
 *                   CALENDAR: "2023-10-27 10:30:00"
 *                 - VALUE: 74.8
 *                   CALENDAR: "2023-10-27 10:25:00"
 *       400:
 *         description: Invalid request. Device ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Device ID is required"
 *       404:
 *         description: No humidity data found for the specified device.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No humidity data found for device 123"
 *       500:
 *         description: Internal server error.
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
    { params }: { params: Promise<{ deviceId: string }> }
  ) {
    try {
      const { deviceId } = await params;
      if (!deviceId) {
        return NextResponse.json({ message: 'Device ID is required' }, { status: 400 });
      }
  
      const dataSource = await getDataSource();
      const corrosionRepository = dataSource.getRepository(Corrosion);
  
      const latestHumidityData = await corrosionRepository.find({
        where: { DEVICE: parseInt(deviceId,10) },
        select: ['ID', 'DEVICE', 'HUMIDITY', 'CALENDAR'],
        order: {
          CALENDAR: 'DESC',
        },
        take: 10,
      });
  
      if (!latestHumidityData || latestHumidityData.length === 0) {
        return NextResponse.json(
          { message: `No humidity data found for device ${deviceId}` },
          { status: 404 }
        );
      }
      const formattedData: DataRecord[] = latestHumidityData.map(record => ({
        VALUE: record.HUMIDITY, 
        CALENDAR: formatDateTime(record.CALENDAR.toLocaleString()),
      }));
  
      return NextResponse.json(formattedData);
    } catch (error) {
      console.error('Error fetching latest humidity data by device:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }