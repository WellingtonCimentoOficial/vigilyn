export interface ChartType {
    title: string
    value: number
}

export type ToastType = {
    title: string
    description: string
    success: boolean
}

export type SelectDataType = {
    id: number
    title: string
    value: string
}

export type SelectType = {
    value: string
    data: SelectDataType[]
    callback: (data: SelectDataType) => void
}

export type CameraFilterType = {
    id: number
    title: string
    value: boolean
}