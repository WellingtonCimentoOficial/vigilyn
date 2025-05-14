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

export type UserExtendedType = UserType & {
    roles: RoleType[]
}

export type TokensType = {
    access_token: string
    refresh_token: string
}