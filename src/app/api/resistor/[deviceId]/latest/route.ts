import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../../../ormconfig';

import { Corrosion } from '@/entity/Corrosion';
import { formatDateTime } from '@/utils/utils';


/**
 * @swagger
 * /api/resistor/{deviceId}/latest:
 *   get:
 *     summary: Retrieve the latest resistor data for a specific device.
 *     tags:
 *       - Resistor
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the device to fetch resistor data for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest resistor data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   VALUE:
 *                     type: number
 *                     description: The resistor value.
 *                   CALENDAR:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the data recording.
 *               example:
 *                 - VALUE: 1024
 *                   CALENDAR: "2023-10-27 10:30:00"
 *                 - VALUE: 1020
 *                   CALENDAR: "2023-10-27 10:25:00"
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
 *         description: No resistor data found for the specified device.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No resistor data found for device 123"
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