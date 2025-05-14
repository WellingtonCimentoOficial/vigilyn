export interface CameraBasicListType {
    id: number
    title: string
    description: string
    url: string
}
export interface UserBasicListType {
    id: number
    title: string
    description: string
    url: string
    status: {
        label: string,
        level: "high" | "medium" | "low"
    }
}
export interface ChartType {
    title: string
    value: number
}

export type ToastType = {
    title: string
    description: string
    success: boolean
}