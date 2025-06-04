[**Demo Dashboard Documentation v0.1.0**](../../../../../../README.md)

***

[Demo Dashboard Documentation](../../../../../../modules.md) / [app/api/latest\_data/\[deviceId\]/route](../README.md) / GET

# Function: GET()

> **GET**(`request`, `__namedParameters`): `Promise`\<`NextResponse`\<\{ `message`: `string`; \}\> \| `NextResponse`\<\{ `CALENDAR`: `string`; `DEVICE`: `number`; `HUMIDITY`: `number`; `RESISTOR`: `number`; `TEMPERATURE`: `number`; \}\>\>

Defined in: [src/app/api/latest\_data/\[deviceId\]/route.ts:91](https://github.com/quanggdungg0609/demo-dashboard/blob/b55cc6ef037a292ef4b8bf41b596e28cace15611/src/app/api/latest_data/[deviceId]/route.ts#L91)

## Parameters

### request

`Request`

### \_\_namedParameters

#### params

`Promise`\<\{ `deviceId`: `string`; \}\>

## Returns

`Promise`\<`NextResponse`\<\{ `message`: `string`; \}\> \| `NextResponse`\<\{ `CALENDAR`: `string`; `DEVICE`: `number`; `HUMIDITY`: `number`; `RESISTOR`: `number`; `TEMPERATURE`: `number`; \}\>\>

## Swagger

/api/latest_data/{deviceId}:
  get:
    summary: Retrieve the latest corrosion data for a specific device.
    tags:
      - Latest Data
    parameters:
      - in: path
        name: deviceId
        schema:
          type: string
        required: true
        description: The ID of the device to fetch the latest data for.
    responses:
      200:
        description: Successfully retrieved the latest device data.
        content:
          application/json:
            schema:
              type: object
              properties:
                DEVICE:
                  type: number
                  description: The device ID.
                HUMIDITY:
                  type: number
                  description: The latest humidity reading.
                TEMPERATURE:
                  type: number
                  description: The latest temperature reading.
                RESISTOR:
                  type: number
                  description: The latest resistor reading.
                CALENDAR:
                  type: string
                  format: date-time
                  description: The timestamp of the latest data recording.
              example:
                DEVICE: 123
                HUMIDITY: 75.2
                TEMPERATURE: 25.5
                RESISTOR: 1000
                CALENDAR: "2023-10-27 10:30:00"
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
        description: No data found for the specified device.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "No data found for this device"
      500:
        description: Internal server error.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Failed to fetch data"
                error:
                  type: string
                  example: "An unknown error occurred"
