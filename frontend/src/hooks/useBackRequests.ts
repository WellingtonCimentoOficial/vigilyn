import { useAxios } from "./useAxios"
import { CameraCreateUpdateType, CameraPaginationType, CameraType, RecordType, RoleType, StorageMonthlyType, SuccessMessageType, SystemType, TokensType, UserExtendedType, UserPaginationType, UserType, UserUpdateType } from "../types/BackendTypes"
import { useCallback } from "react"

type GetCameraProps = {
    search?: string
    pid?: boolean
    requires_restart?: boolean
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

    const getCameras = useCallback(async ({search, pid, requires_restart, page, limit} : GetCameraProps = {}) => {
        const params = Object.fromEntries(
            Object.entries({ search, pid, requires_restart, page, limit })
            .filter(([_, value]) => value != null)
        )

        const response = await axiosPrivate.get("/cameras/", {
            params
        })
        const data: CameraPaginationType = await response.data
        return data
    }, [axiosPrivate])

    const getCamera = useCallback(async (cameraId: number) => {
        const response = await axiosPrivate.get(`/cameras/${cameraId}/`)
        const data: CameraType = response.data
        return data
    }, [axiosPrivate])

    const deleteCamera = useCallback(async (cameraId: number) => {
        const response = await axiosPrivate.delete(`/cameras/${cameraId}/`)
        const data: SuccessMessageType = await response.data
        return data
    }, [axiosPrivate])

    const startCamera = useCallback(async (cameraId: number) => {
        const response = await axiosPrivate.post(`/cameras/${cameraId}/start/`)
        const data: CameraType = response.data
        return data
    }, [axiosPrivate])

    const stopCamera = useCallback(async (cameraId: number) => {
        const response = await axiosPrivate.post(`/cameras/${cameraId}/stop/`)
        const data: SuccessMessageType = response.data
        return data
    }, [axiosPrivate])

    const restartCamera = useCallback(async (cameraId: number) => {
        const response = await axiosPrivate.post(`/cameras/${cameraId}/restart/`)
        const data: SuccessMessageType = response.data
        return data
    }, [axiosPrivate])

    const updateCamera = useCallback(async (cameraId: number, cameraData: CameraCreateUpdateType) => {
        const response = await axiosPrivate.patch(`/cameras/${cameraId}/`, {...cameraData})
        const data: CameraType = response.data
        return data
    }, [axiosPrivate])

    const createCamera = useCallback(async (cameraData: CameraCreateUpdateType) => {
        const response = await axiosPrivate.post("/cameras/", {...cameraData})
        const data: CameraType = response.data
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
        const data: UserPaginationType = response.data
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
        getCamera,
        deleteCamera,
        startCamera,
        stopCamera,
        restartCamera,
        updateCamera,
        createCamera,
        getSystem, 
        getStorage, 
        getRecords,
        getUsers,
        getRoles,
        updateMe
    }
}