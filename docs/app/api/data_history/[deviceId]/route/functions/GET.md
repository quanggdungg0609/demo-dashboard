[**Demo Dashboard Documentation v0.1.0**](../../../../../../README.md)

***

[Demo Dashboard Documentation](../../../../../../modules.md) / [app/api/data\_history/\[deviceId\]/route](../README.md) / GET

# Function: GET()

> **GET**(`request`, `context`): `Promise`\<`NextResponse`\<\{ `message`: `string`; \}\> \| `NextResponse`\<\{ `currentPage`: `number`; `data`: `object`[]; `limit`: `number`; `totalItems`: `number`; `totalPages`: `number`; \}\>\>

Defined in: [src/app/api/data\_history/\[deviceId\]/route.ts:110](https://github.com/quanggdungg0609/demo-dashboard/blob/b55cc6ef037a292ef4b8bf41b596e28cace15611/src/app/api/data_history/[deviceId]/route.ts#L110)

## Parameters

### request

`NextRequest`

### context

#### params

`Promise`\<\{ `deviceId`: `string`; \}\>

## Returns

`Promise`\<`NextResponse`\<\{ `message`: `string`; \}\> \| `NextResponse`\<\{ `currentPage`: `number`; `data`: `object`[]; `limit`: `number`; `totalItems`: `number`; `totalPages`: `number`; \}\>\>

## Swagger

/api/data_history/{deviceId}:
  get:
    summary: Retrieve historical corrosion data for a specific device with pagination.
    description: Fetches a paginated list of historical corrosion data (temperature, humidity, resistor, and calendar date) for a given device ID.
    tags:
      - Data History
    parameters:
      - in: path
        name: deviceId
        required: true
        description: The ID of the device to fetch data for.
        schema:
          type: string
      - in: query
        name: page
        required: false
        description: The page number for pagination (default is 1).
        schema:
          type: integer
          default: 1
      - in: query
        name: limit
        required: false
        description: The number of items per page (default is 5).
        schema:
          type: integer
          default: 5
    responses:
      200:
        description: A list of historical corrosion data for the device.
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: array
                  items:
                    type: object
                    properties:
                      ID:
                        type: integer
                        example: 1
                      TEMPERATURE:
                        type: number
                        format: float
                        example: 25.5
                      HUMIDITY:
                        type: number
                        format: float
                        example: 60.2
                      RESISTOR:
                        type: number
                        format: float
                        example: 1000.0
                      CALENDAR:
                        type: string
                        example: "2023-10-27 10:30:00"
                totalItems:
                  type: integer
                  example: 100
                totalPages:
                  type: integer
                  example: 20
                currentPage:
                  type: integer
                  example: 1
                limit:
                  type: integer
                  example: 5
      400:
        description: Bad Request - Device ID is required.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Device ID is required"
      404:
        description: Not Found - No data found for the specified device ID.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "No temperature data found for device {deviceId}"
      500:
        description: Internal Server Error.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Internal server error"
