import { useAxios } from "./useAxios"
import { CameraCreateUpdateType, CameraPaginationType, CameraType, RecordPaginationType, RoleType, SettingsType, SettingsUpdateType, StorageMonthlyType, SuccessMessageType, SystemType, TokensType, UserExtendedType, UserPaginationType, UserUpdateType } from "../types/BackendTypes"
import { useCallback } from "react"

type GetCameraProps = {
    search?: string
    pid?: boolean
    requires_restart?: boolean
    is_recording?: boolean
    page?: number
    limit?: number
}

type GetRecordsProps = {
    search?: string
    page?: number
    limit?: number
    show_favorites?: boolean
    initial_date?: string
    final_date?: string
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
        const data: UserExtendedType = await response.data
        return data
    }, [axiosPrivate])

    const updateFavorite = useCallback(async (recordIds: number[]) => {
        const response = await axiosPrivate.put("/users/me/favorites/", {
            record_ids: recordIds
        })
        const data: UserExtendedType = await response.data
        return data
    }, [axiosPrivate])

    const getCameras = useCallback(async ({search, pid, requires_restart, is_recording, page, limit} : GetCameraProps = {}) => {
        const params = Object.fromEntries(
            Object.entries({ search, pid, requires_restart, is_recording, page, limit })
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

    const getRecords = useCallback(async ({ search, limit, page, show_favorites, initial_date, final_date }: GetRecordsProps = {}) => {
        const params = Object.fromEntries(
            Object.entries({ search, page, limit, show_favorites, initial_date, final_date })
            .filter(([_, value]) => value != null)
        )

        const response = await axiosPrivate.get(`/records/`, {
            params
        })
        const data: RecordPaginationType = response.data
        return data
    }, [axiosPrivate])

    const getRecordThumbnail = useCallback(async (recordId: number) => {
        const response = await axiosPrivate.get(`/records/${recordId}/video/thumbnail/`,{
            responseType: "blob"
        })
        const blob = await response.data
        const data: string = URL.createObjectURL(blob)
        return data
    }, [axiosPrivate])

    const downloadRecord = useCallback(async (recordId: number) => {
        const response = await axiosPrivate.get(`/records/${recordId}/video/download/`,{
            responseType: "blob"
        })
        const blob = await response.data
        const data: string = URL.createObjectURL(blob)
        return data
    }, [axiosPrivate])

    const deleteRecord = useCallback(async (recordId: number) => {
        const response = await axiosPrivate.delete(`/records/${recordId}/`)
        const data: SuccessMessageType = await response.data
        return data
    }, [axiosPrivate])

    const deleteRecords = useCallback(async (recordIds: number[]) => {
        const response = await axiosPrivate.delete("/records/", {
            data: {ids: recordIds},
        })
        const data: SuccessMessageType = await response.data
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

    const getSettings = useCallback(async () => {
        const response = await axiosPrivate.get("/settings/")
        const data: SettingsType = await response.data
        return data
    }, [axiosPrivate])

    const updateSettings = useCallback(async (settingsData: SettingsUpdateType) => {
        const response = await axiosPrivate.patch("/settings/", {...settingsData})
        const data: SettingsType = await response.data
        return data
    }, [axiosPrivate])

    const restartSystem = useCallback(async () => {
        const response = await axiosPrivate.post("/system/restart/")
        const data: SuccessMessageType = await response.data
        return data
    }, [axiosPrivate])

    const stopSystem = useCallback(async () => {
        const response = await axiosPrivate.post("/system/stop/")
        const data: SuccessMessageType = await response.data
        return data
    }, [axiosPrivate])

    return {
        signIn, 
        signOut, 
        refreshTokens, 
        getMe,
        updateFavorite,
        getCameras,
        getCamera,
        deleteCamera,
        startCamera,
        stopCamera,
        restartCamera,
        updateCamera,
        createCamera,
        getSystem,
        restartSystem,
        stopSystem,
        getStorage, 
        getRecords,
        getRecordThumbnail,
        downloadRecord,
        deleteRecord,
        deleteRecords,
        getUsers,
        getRoles,
        updateMe,
        getSettings,
        updateSettings
    }
}