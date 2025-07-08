import { useAxios } from "./useAxios"
import { CameraCreateUpdateType, CameraPaginationType, CameraType, RecordPaginationType, RecordType, RecordUpdateType, RoleType, SettingsType, SettingsUpdateType, StorageMonthlyType, SuccessMessageType, SystemType, TokensType, UserProfileType, UserPaginationType, UserProfileUpdateType, UserUpdateType, UserType, RoleUpdateType, UserCreateType } from "../types/BackendTypes"
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
    initial_hour?: string
    final_hour?: string
    cameraIds?: number[]
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

    const getMe = useCallback(async (): Promise<UserProfileType> => {
        const response = await axiosPrivate.get("/users/me/")
        const data: UserProfileType = await response.data
        return data
    }, [axiosPrivate])

    const updateMe = useCallback(async (userUpdateData: UserProfileUpdateType) => {
        const response = await axiosPrivate.patch("/users/me/", {...userUpdateData})
        const data: UserProfileType = await response.data
        return data
    }, [axiosPrivate])

    const updateFavorite = useCallback(async (recordIds: number[]) => {
        const response = await axiosPrivate.put("/users/me/favorites/", {
            record_ids: recordIds
        })
        const data: UserProfileType = await response.data
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

    const getRecords = useCallback(async ({ search, limit, page, show_favorites, initial_date, final_date, initial_hour, final_hour, cameraIds }: GetRecordsProps = {}) => {
        const rawParams = { 
            search, page, limit, show_favorites, initial_date, 
            final_date, initial_hour, final_hour 
        }

        const params = Object.fromEntries(Object.entries(rawParams).filter(([_, value]) => value != null && value !== undefined && value !== ""))

        const urlParams = new URLSearchParams()

        if(cameraIds?.length){
            for(const id of cameraIds){
                urlParams.append("camera_id", String(id))
            }
        }

        for (const [key, value] of Object.entries(params)){
            urlParams.append(key, String(value))
        }

        const response = await axiosPrivate.get(`/records/?${urlParams.toString()}`)
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

    const getRecordVideo = useCallback(async (recordId: number) => {
        const response = await axiosPrivate.get(`/records/${recordId}/video/`,{
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

    const updateRecord = useCallback(async (recordId: number, recordData: RecordUpdateType) => {
        const response = await axiosPrivate.patch(`/records/${recordId}/`, {...recordData})
        const data: RecordType = response.data
        return data
    }, [axiosPrivate])

    const deleteRecord = useCallback(async (recordId: number) => {
        const response = await axiosPrivate.delete(`/records/${recordId}/`)
        const data: SuccessMessageType = await response.data
        return data
    }, [axiosPrivate])

    const deleteRecords = useCallback(async (recordIds: number[]) => {
        const params = recordIds.map(recordId => `id=${recordId}`).join("&")
        const response = await axiosPrivate.delete(`/records/?${params}`)
        const data: SuccessMessageType = await response.data
        return data
    }, [axiosPrivate])

    const downloadMultipleRecords = useCallback(async (recordIds: number[]) => {
        const params = recordIds.map(recordId => `id=${recordId}`).join("&")
        const response = await axiosPrivate.get(`/records/videos/download/?${params}`, {
            responseType: "blob"
        })
        const blob = await response.data
        const data: string = URL.createObjectURL(blob)
        return data
    }, [axiosPrivate])

    const createUser = useCallback(async (user: UserCreateType) => {
        const response = await axiosPrivate.post("/users/", {...user})
        const data: UserType = await response.data
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

    const deleteUser = useCallback(async (userId: number) => {
        const response = await axiosPrivate.delete(`/users/${userId}/`)
        const data: SuccessMessageType = await response.data
        return data
    }, [axiosPrivate])

    const updateUser = useCallback(async (userId: number, userData: UserUpdateType) => {
        const response = await axiosPrivate.patch(`/users/${userId}/`, {...userData})
        const data: UserType = await response.data
        return data
    }, [axiosPrivate])

    const getUserRoles = useCallback(async (userId: number) => {
        const response = await axiosPrivate.get(`/users/${userId}/roles/`)
        const data: RoleType[] = await response.data
        return data
    }, [axiosPrivate])

    const updateUserRoles = useCallback(async (userId: number, userRolesData: RoleUpdateType) => {
        const response = await axiosPrivate.put(`/users/${userId}/roles/`, {...userRolesData})
        const data: RoleType[] = await response.data
        return data
    }, [axiosPrivate])

    const getRoles = useCallback(async () => {
        const response = await axiosPrivate.get("/roles/")
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
        getRecordVideo,
        downloadRecord,
        downloadMultipleRecords,
        deleteRecord,
        updateRecord,
        deleteRecords,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
        getUserRoles,
        updateUserRoles,
        updateMe,
        getSettings,
        updateSettings,
        getRoles
    }
}