export type PermissionType = {
    id: number
    name: string
}

export type RoleType = {
    id: number
    name: string
    permissions: PermissionType[]
}

export type RoleUpdateType = {
    role_ids: number[]
}

export type UserType = {
    id: number
    name: string
    profile_color: string
    email: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type UserProfileUpdateType = {
    name: string
    profile_color?: string
    password?: string
    confirm_password?: string
}

export type UserUpdateType = UserProfileUpdateType & {
    is_active: boolean
}

export type UserFavoriteType = {
    id: number
    records: number[]
}

export type UserExtendedType = UserType & {
    roles: RoleType[]
}

export type UserProfileType = UserExtendedType & {
    favorite: UserFavoriteType
}

export type UserCreateType = {
    name: string
    email: string
    password: string
    confirm_password: string
    is_active: boolean
}

export type TokensType = {
    access_token: string
    refresh_token: string
}

export type CameraType = {
    id: number,
    name: string,
    profile_color: string
    ip_address: string
    port: number
    username: string
    password: string
    path: string
    pid: number | null
    requires_restart: boolean
    is_recording: boolean
}

export type CameraMinimalType = {
    id: number
    name: string
    profile_color: string
}

export type CameraCreateUpdateType = {
    name: string,
    profile_color?: string
    ip_address: string
    port: number
    username?: string
    password?: string
    path?: string
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
    name: string
    path: string
    format: string
    duration_seconds: number
    camera: CameraMinimalType
    created_at: string
    updated_at: string
}
export type RecordPaginationType = PaginationType & {
    data: RecordType[]
}
export type RecordToken = {
    token: string
}
export type ErrorType = {
    error: string
    message: string
}
export type ErrorValidationType = ErrorType & {
    message: Record<string, string[]>
}

export type SuccessMessageType = {
    message: string
}
export type PaginationType = {
    current_page: number
    total_count: number
    limit: number
}
export type CameraPaginationType = PaginationType & {
    data: CameraType[]
}
export type UserPaginationType = PaginationType & {
    data: UserType[]
}
export type SettingsUpdateType = {
    save_directory_path?: string
    allow_notifications?: boolean
    tmp_directory_path?: string
    segment_time?: number
    auto_delete_enabled?: boolean
}
export type SettingsType = {
    save_directory_path: string
    allow_notifications: boolean
    tmp_directory_path: string
    segment_time: number
    requires_restart: boolean
    auto_delete_enabled: boolean
}
export type RecordUpdateType = {
    name: string
}