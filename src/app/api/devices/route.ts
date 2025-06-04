import { NextResponse } from "next/server";
import {getDataSource } from '../../../../ormconfig';
import { Corrosion } from '@/entity/Corrosion';

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Retrieve a list of distinct device IDs.
 *     description: Fetches all unique device IDs from the corrosion data.
 *     tags:
 *       - Devices
 *     responses:
 *       200:
 *         description: A list of distinct device IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 devices:
 *                   type: array
 *                   items:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch devices"
 *                 error:
 *                   type: string
 *                   example: "An unknown error occurred"
 */
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