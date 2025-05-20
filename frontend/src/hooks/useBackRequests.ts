import { useAxios } from "./useAxios"
import { CameraType, RecordType, RoleType, StorageMonthlyType, SuccessMessageType, SystemType, TokensType, UserExtendedType, UserType, UserUpdateType } from "../types/BackendTypes"
import { useCallback } from "react"

type GetCameraProps = {
    search?: string
    pid?: string
    page?: number
    limit?: number
}

type GetUsersProps = {
    search?: string
    role?: string
    is_active?: string
    page?: number
    limit?: number
}

export const useBackendRequests = () => {
    const { axios, axiosPrivate } = useAxios()

    const refreshTokens = useCallback(async (refreshToken: string): Promise<TokensType> => {
        const response = await axios.post("/auth/refresh/", null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })
        const data : TokensType = await response.data
        
        return data
    }, [axios])

    const signIn = useCallback(async (email: string, password: string): Promise<TokensType> => {
        const response = await axios.post("/auth/signin/", {email, password})
        const data : TokensType = response.data

        return data
    }, [axios])

    const signOut = useCallback(async (refreshToken: string) => {
        const response = axios.post("/auth/signout/", null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })
        return response
    }, [axios])

    const getMe = useCallback(async (): Promise<UserExtendedType> => {
        const response = await axiosPrivate.get("/users/me/")
        const data: UserExtendedType = await response.data
        return data
    }, [axiosPrivate])

    const updateMe = useCallback(async (userUpdateData: UserUpdateType) => {
        const response = await axiosPrivate.patch("/users/me/", {...userUpdateData})
        const data: UserType = await response.data
        return data
    }, [axiosPrivate])

    const getCameras = useCallback(async ({search, pid, page, limit} : GetCameraProps = {}) => {
        const params = Object.fromEntries(
            Object.entries({ search, pid, page, limit })
            .filter(([_, value]) => value != null)
        )

        const response = await axiosPrivate.get("/cameras/", {
            params
        })
        const data: CameraType[] = await response.data.data
        return data
    }, [axiosPrivate])

    const deleteCamera = useCallback(async (cameraId: number) => {
        const response = await axiosPrivate.delete(`/cameras/${cameraId}/`)
        const data: SuccessMessageType = await response.data
        return data
    }, [axiosPrivate])

    const getSystem = useCallback(async () => {
        const response = await axiosPrivate.get("/system/")
        const data: SystemType = await response.data
        return data
    }, [axiosPrivate])

    const getStorage = useCallback(async () => {
        const response = await axiosPrivate.get("/system/storage/")
        const data: StorageMonthlyType[] = await response.data
        return data
    }, [axiosPrivate])

    const getRecords = useCallback(async (cameraId: number) => {
        const response = await axiosPrivate.get(`/cameras/${cameraId}/records/`)
        const data: RecordType[] = response.data
        return data
    }, [axiosPrivate])

    const getUsers = useCallback(async ({search, role, is_active, page, limit}: GetUsersProps = {}) => {
        const params = Object.fromEntries(
            Object.entries({ search, role, is_active, page, limit })
            .filter(([_, value]) => value != null)
        )
        
        const response = await axiosPrivate.get("/users/", {params})
        const data: UserType[] = response.data.data
        return data
    }, [axiosPrivate])

    const getRoles = useCallback(async (userId: number) => {
        const response = await axiosPrivate.get(`/users/${userId}/roles/`)
        const data: RoleType[] = await response.data
        return data
    }, [axiosPrivate])


    return {
        signIn, 
        signOut, 
        refreshTokens, 
        getMe, 
        getCameras,
        deleteCamera,
        getSystem, 
        getStorage, 
        getRecords,
        getUsers,
        getRoles,
        updateMe
    }
}