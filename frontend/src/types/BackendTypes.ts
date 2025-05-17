export type PermissionType = {
    id: number
    name: string
}

export type RoleType = {
    id: number
    name: string
    permissions: PermissionType[]
}

export type UserType = {
    id: number
    name: string
    email: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type UserUpdateType = {
    name: string
    password?: string
    confirm_password?: string
}

export type UserExtendedType = UserType & {
    roles: RoleType[]
}

export type TokensType = {
    access_token: string
    refresh_token: string
}

export type CameraType = {
    id: number,
    name: string,
    ip_address: string
    port: number
    username: string
    password: string
    path: string
    pid: number | null
    requires_restart: boolean
}

export type CpuType = {
    cores: number
    threads: number
    percent_used: number
}

export type RamType = {
    free: number
    used: number
    total: number
    percent_used: number
}

export type StorageType = {
    free: number
    used: number
    total: number
    percent_used: number
}
export type StorageMonthlyType = {
    id: number
    month: string
    total: number
}

export type SystemType = {
    cpu: CpuType
    ram: RamType
    storage: StorageType
    time: string
}

export type RecordType = {
    id: number
    path: string
    created_at: string
}
export type ValidationErrorType = {
    error: string
    message: Record<string, string[]>
}