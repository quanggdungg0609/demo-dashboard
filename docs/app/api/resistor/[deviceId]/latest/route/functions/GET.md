[**Demo Dashboard Documentation v0.1.0**](../../../../../../../README.md)

***

[Demo Dashboard Documentation](../../../../../../../modules.md) / [app/api/resistor/\[deviceId\]/latest/route](../README.md) / GET

# Function: GET()

> **GET**(`request`, `__namedParameters`): `Promise`\<`NextResponse`\<[`DataRecord`](../../../../../../../types/type/interfaces/DataRecord.md)[]\> \| `NextResponse`\<\{ `message`: `string`; \}\>\>

Defined in: [src/app/api/resistor/\[deviceId\]/latest/route.ts:75](https://github.com/quanggdungg0609/demo-dashboard/blob/b55cc6ef037a292ef4b8bf41b596e28cace15611/src/app/api/resistor/[deviceId]/latest/route.ts#L75)

## Parameters

### request

`NextRequest`

### \_\_namedParameters

#### params

`Promise`\<\{ `deviceId`: `string`; \}\>

## Returns

`Promise`\<`NextResponse`\<[`DataRecord`](../../../../../../../types/type/interfaces/DataRecord.md)[]\> \| `NextResponse`\<\{ `message`: `string`; \}\>\>

## Swagger

/api/resistor/{deviceId}/latest:
  get:
    summary: Retrieve the latest resistor data for a specific device.
    tags:
      - Resistor
    parameters:
      - in: path
        name: deviceId
        schema:
          type: string
        required: true
        description: The ID of the device to fetch resistor data for.
    responses:
      200:
        description: Successfully retrieved the latest resistor data.
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  VALUE:
                    type: number
                    description: The resistor value.
                  CALENDAR:
                    type: string
                    format: date-time
                    description: The timestamp of the data recording.
              example:
                - VALUE: 1024
                  CALENDAR: "2023-10-27 10:30:00"
                - VALUE: 1020
                  CALENDAR: "2023-10-27 10:25:00"
      400:
        description: Invalid request. Device ID is required or invalid format.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Device ID is required" or "Invalid Device ID format"
      404:
        description: No resistor data found for the specified device.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "No resistor data found for device 123"
      500:
        description: Internal server error.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Internal server error"
