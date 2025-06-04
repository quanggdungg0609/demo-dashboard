[**Demo Dashboard Documentation v0.1.0**](../../../../../../../README.md)

***

[Demo Dashboard Documentation](../../../../../../../modules.md) / [app/api/temperature/\[deviceId\]/latest/route](../README.md) / GET

# Function: GET()

> **GET**(`request`, `__namedParameters`): `Promise`\<`NextResponse`\<[`DataRecord`](../../../../../../../types/type/interfaces/DataRecord.md)[]\> \| `NextResponse`\<\{ `message`: `string`; \}\>\>

Defined in: [src/app/api/temperature/\[deviceId\]/latest/route.ts:74](https://github.com/quanggdungg0609/demo-dashboard/blob/b55cc6ef037a292ef4b8bf41b596e28cace15611/src/app/api/temperature/[deviceId]/latest/route.ts#L74)

## Parameters

### request

`NextRequest`

### \_\_namedParameters

#### params

`Promise`\<\{ `deviceId`: `string`; \}\>

## Returns

`Promise`\<`NextResponse`\<[`DataRecord`](../../../../../../../types/type/interfaces/DataRecord.md)[]\> \| `NextResponse`\<\{ `message`: `string`; \}\>\>

## Swagger

/api/temperature/{deviceId}/latest:
  get:
    summary: Retrieve the latest temperature data for a specific device.
    tags:
      - Temperature
    parameters:
      - in: path
        name: deviceId
        schema:
          type: string
        required: true
        description: The ID of the device to fetch temperature data for.
    responses:
      200:
        description: Successfully retrieved the latest temperature data.
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  VALUE:
                    type: number
                    description: The temperature value.
                  CALENDAR:
                    type: string
                    format: date-time
                    description: The timestamp of the data recording.
              example:
                - VALUE: 25.5
                  CALENDAR: "2023-10-27 10:30:00"
                - VALUE: 25.0
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
        description: No temperature data found for the specified device.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "No temperature data found for device 123"
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
