import { createContext, useCallback, useEffect, useState } from "react";
import { useBackendRequests } from "../hooks/useBackRequests";
import { TokensType } from "../types/BackendTypes";
import { useNavigate } from "react-router";
import LoaderLogoComponent from "../components/LoaderLogoComponent/LoaderLogoComponent";

type AuthContextType = {
    tokens: TokensType
    isAuthenticated: boolean
    isLoading: boolean
    setTokens: React.Dispatch<React.SetStateAction<TokensType>>
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    createSession: (updatedTokens: TokensType) => void
    clearSession: () => void
}

const initialData: AuthContextType = {
    tokens: {access_token: "", refresh_token: ""},
    isAuthenticated: false,
    isLoading: true,
    setTokens: () => {},
    setIsAuthenticated: () => {},
    createSession: () => {},
    clearSession: () => {}
}

type Props = {
    children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType>(initialData)

export const AuthContextProvider = ({children} : Props) => {
    const [tokens, setTokens] = useState<TokensType>(initialData.tokens)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialData.isAuthenticated)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { refreshTokens } = useBackendRequests()

    const navigate = useNavigate()

    const getLocalToken = useCallback(async (): Promise<string | null> => {
        const refreshToken = await localStorage.getItem("RefreshToken")
        return refreshToken
    }, [])

    const storeToken = (refreshToken: string) => {
        localStorage.setItem("RefreshToken", refreshToken)
    }

    const createSession = useCallback((updatedTokens: TokensType) => {
        storeToken(updatedTokens.refresh_token)
        setTokens(updatedTokens)
        setIsAuthenticated(true)
    }, [])

    const clearSession = useCallback(() => {
        setTokens({"access_token": "", "refresh_token": ""})
        setIsAuthenticated(false)
        localStorage.removeItem("RefreshToken")
    }, [])
    

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const refreshToken = await getLocalToken()
            if(refreshToken){
                try {
                    const updatedTokens = await refreshTokens(refreshToken)
                    createSession(updatedTokens)
                } catch (error) {
                    clearSession()
                }
            }
            setIsLoading(false)
        })()
    }, [refreshTokens, getLocalToken, createSession, clearSession])

    useEffect(() => {
        if(!isLoading && !isAuthenticated){
            navigate("/auth/sign-in/")
        }
    }, [isAuthenticated, isLoading, navigate])
    
    return (
        <AuthContext.Provider value={{tokens, isAuthenticated, isLoading, setTokens, setIsAuthenticated, createSession, clearSession}}>
            { isLoading ? <LoaderLogoComponent /> : children}
        </AuthContext.Provider>
    )
}