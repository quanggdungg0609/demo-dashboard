import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../../ormconfig';
import { Corrosion } from '@/entity/Corrosion';
import { formatDateTime } from '@/utils/utils';




interface Params {
    deviceId: string;
}

/**
 * @swagger
 * /api/latest_data/{deviceId}:
 *   get:
 *     summary: Retrieve the latest corrosion data for a specific device.
 *     tags:
 *       - Latest Data
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the device to fetch the latest data for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest device data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 DEVICE:
 *                   type: number
 *                   description: The device ID.
 *                 HUMIDITY:
 *                   type: number
 *                   description: The latest humidity reading.
 *                 TEMPERATURE:
 *                   type: number
 *                   description: The latest temperature reading.
 *                 RESISTOR:
 *                   type: number
 *                   description: The latest resistor reading.
 *                 CALENDAR:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp of the latest data recording.
 *               example:
 *                 DEVICE: 123
 *                 HUMIDITY: 75.2
 *                 TEMPERATURE: 25.5
 *                 RESISTOR: 1000
 *                 CALENDAR: "2023-10-27 10:30:00"
 *       400:
 *         description: Invalid request. Device ID is required or invalid format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Device ID is required" or "Invalid Device ID format"
 *       404:
 *         description: No data found for the specified device.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No data found for this device"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch data"
 *                 error:
 *                   type: string
 *                   example: "An unknown error occurred"
 */
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
