import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../../../ormconfig';
import { Corrosion } from '@/entity/Corrosion';
import { formatDateTime } from '@/utils/utils';


/**
 * @swagger
 * /api/temperature/{deviceId}/latest:
 *   get:
 *     summary: Retrieve the latest temperature data for a specific device.
 *     tags:
 *       - Temperature
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the device to fetch temperature data for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest temperature data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   VALUE:
 *                     type: number
 *                     description: The temperature value.
 *                   CALENDAR:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the data recording.
 *               example:
 *                 - VALUE: 25.5
 *                   CALENDAR: "2023-10-27 10:30:00"
 *                 - VALUE: 25.0
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
 *         description: No temperature data found for the specified device.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No temperature data found for device 123"
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