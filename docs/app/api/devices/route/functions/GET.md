[**Demo Dashboard Documentation v0.1.0**](../../../../../README.md)

***

[Demo Dashboard Documentation](../../../../../modules.md) / [app/api/devices/route](../README.md) / GET

# Function: GET()

> **GET**(`request`): `Promise`\<`NextResponse`\<\{ `devices`: `any`[]; \}\> \| `NextResponse`\<\{ `error`: `string`; `message`: `string`; \}\>\>

Defined in: [src/app/api/devices/route.ts:40](https://github.com/quanggdungg0609/demo-dashboard/blob/b55cc6ef037a292ef4b8bf41b596e28cace15611/src/app/api/devices/route.ts#L40)

## Parameters

### request

`Request`

## Returns

`Promise`\<`NextResponse`\<\{ `devices`: `any`[]; \}\> \| `NextResponse`\<\{ `error`: `string`; `message`: `string`; \}\>\>

## Swagger

/api/devices:
  get:
    summary: Retrieve a list of distinct device IDs.
    description: Fetches all unique device IDs from the corrosion data.
    tags:
      - Devices
    responses:
      200:
        description: A list of distinct device IDs.
        content:
          application/json:
            schema:
              type: object
              properties:
                devices:
                  type: array
                  items:
                    type: integer
                    example: 1
      500:
        description: Internal Server Error.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Failed to fetch devices"
                error:
                  type: string
                  example: "An unknown error occurred"
