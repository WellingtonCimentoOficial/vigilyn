import { useAxios } from "./useAxios"
import { TokensType, UserExtendedType } from "../types/BackendTypes"
import { useCallback } from "react"

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

    return {signIn, signOut, refreshTokens, getMe}
}