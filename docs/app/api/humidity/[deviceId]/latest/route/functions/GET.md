[**Demo Dashboard Documentation v0.1.0**](../../../../../../../README.md)

***

[Demo Dashboard Documentation](../../../../../../../modules.md) / [app/api/humidity/\[deviceId\]/latest/route](../README.md) / GET

# Function: GET()

> **GET**(`request`, `__namedParameters`): `Promise`\<`NextResponse`\<\{ `message`: `string`; \}\> \| `NextResponse`\<[`DataRecord`](../../../../../../../types/type/interfaces/DataRecord.md)[]\>\>

Defined in: [src/app/api/humidity/\[deviceId\]/latest/route.ts:74](https://github.com/quanggdungg0609/demo-dashboard/blob/b55cc6ef037a292ef4b8bf41b596e28cace15611/src/app/api/humidity/[deviceId]/latest/route.ts#L74)

## Parameters

### request

`NextRequest`

### \_\_namedParameters

#### params

`Promise`\<\{ `deviceId`: `string`; \}\>

## Returns

`Promise`\<`NextResponse`\<\{ `message`: `string`; \}\> \| `NextResponse`\<[`DataRecord`](../../../../../../../types/type/interfaces/DataRecord.md)[]\>\>

## Swagger

/api/humidity/{deviceId}/latest:
  get:
    summary: Retrieve the latest humidity data for a specific device.
    tags:
      - Humidity
    parameters:
      - in: path
        name: deviceId
        schema:
          type: string
        required: true
        description: The ID of the device to fetch humidity data for.
    responses:
      200:
        description: Successfully retrieved the latest humidity data.
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  VALUE:
                    type: number
                    description: The humidity value.
                  CALENDAR:
                    type: string
                    format: date-time
                    description: The timestamp of the data recording.
              example:
                - VALUE: 75.2
                  CALENDAR: "2023-10-27 10:30:00"
                - VALUE: 74.8
                  CALENDAR: "2023-10-27 10:25:00"
      400:
        description: Invalid request. Device ID is required.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Device ID is required"
      404:
        description: No humidity data found for the specified device.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "No humidity data found for device 123"
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
