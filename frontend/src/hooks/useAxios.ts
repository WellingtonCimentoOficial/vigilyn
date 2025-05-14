import { useContext, useMemo } from "react"
import { AuthContext } from "../contexts/AuthContext"
import ax from "axios";

export const useAxios = () => {
    const { tokens } = useContext(AuthContext)

    const BASE_URL = "http://127.0.0.1:5000/api"

    const axios = useMemo(() => {
        return ax.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }, [])

    const axiosPrivate = useMemo(() => {
       return ax.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens.access_token}`
            }
        })
    }, [tokens.access_token])

    return {axios, axiosPrivate}
}