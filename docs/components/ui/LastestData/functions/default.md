[**Demo Dashboard Documentation v0.1.0**](../../../../README.md)

***

[Demo Dashboard Documentation](../../../../modules.md) / [components/ui/LastestData](../README.md) / default

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/components/ui/LastestData.tsx:16](https://github.com/quanggdungg0609/demo-dashboard/blob/b55cc6ef037a292ef4b8bf41b596e28cace15611/src/components/ui/LastestData.tsx#L16)

## Parameters

### props

`LatestDataProps`

The props for the component.

## Returns

`Element`

The JSX element displaying the latest data.

## Component

LastestData

## Description

Displays the latest sensor data (temperature, humidity, resistor) for a given device.
It fetches the data initially and then uses a Web Worker to receive real-time updates.
