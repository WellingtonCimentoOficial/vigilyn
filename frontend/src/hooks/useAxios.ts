import { useCallback, useContext, useMemo } from "react"
import { AuthContext } from "../contexts/AuthContext"
import ax, { AxiosRequestConfig, AxiosResponse } from "axios";

export const BASE_URL = process.env.NODE_ENV === "development" ? "http://127.0.0.1:80/api" : "/api"

export const useAxios = () => {
    const { tokens, isLoading } = useContext(AuthContext)

    const axios = useMemo(() => {
        return ax.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }, [])

    const axiosInstance = useMemo(() => {
        return ax.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens.access_token}`
            }
        })
    }, [tokens.access_token])

    const waitForLoadingToFinish = useCallback(() => {
        return new Promise<void>((resolve) => {
            if (!isLoading) return resolve()
            const interval = setInterval(() => {
                if (!isLoading) {
                    clearInterval(interval)
                    resolve()
                }
            }, 10)
        })
    }, [isLoading])

    const createMethod = useCallback(
        (method: string) =>
            async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
                await waitForLoadingToFinish()
                
                if (method === "get" || method === "delete") {
                    return axiosInstance.request<T>({
                        method,
                        url,
                        ...(data || {}),
                    })
            }

            return axiosInstance.request<T>({
                method,
                url,
                data,
                ...config,
            })
            },
        [axiosInstance, waitForLoadingToFinish]
    )

    const axiosPrivate = useMemo(() => ({
        get:    createMethod("get"),
        post:   createMethod("post"),
        put:    createMethod("put"),
        patch:  createMethod("patch"),
        delete: createMethod("delete"),
        request: async <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
            await waitForLoadingToFinish()
            return axiosInstance.request<T>(config)
        }
    }), [createMethod, waitForLoadingToFinish, axiosInstance])

    return {axios, axiosPrivate}
}