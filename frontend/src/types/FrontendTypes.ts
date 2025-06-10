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
    fullWidth?: boolean
    value: string
    data: SelectDataType[]
    disabled?: boolean
    callback: (data: SelectDataType) => void
}

export type CheckBoxFilterType = {
    id: number
    title: string
    value: boolean
}

export type ModalConfirmationData = {
    title: string
    description: string
    callback: () => void
}