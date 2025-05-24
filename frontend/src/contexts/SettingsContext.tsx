import { createContext, useContext, useEffect, useState } from "react";
import { SettingsType } from "../types/BackendTypes";
import { AuthContext } from "./AuthContext";
import { ToastContext } from "./ToastContext";
import { useBackendRequests } from "../hooks/useBackRequests";

type SettingsContextType = {
    settings: SettingsType | null
    setSettings: React.Dispatch<React.SetStateAction<SettingsType | null>>
}

type Props = {
    children: React.ReactNode
}

const initialData: SettingsContextType = {
    settings: null,
    setSettings: () => {}
}


export const SettingsContext = createContext<SettingsContextType>(initialData)

export const SettingsContextProvider = ({children}: Props) => {
    const [settings, setSettings] = useState<SettingsType|null>(null)

    const { isAuthenticated } = useContext(AuthContext)
    const { setToastMessage } = useContext(ToastContext)
    const { getSettings } = useBackendRequests()

    useEffect(() => {
        (async () => {
            if(isAuthenticated){
                try {
                    const data = await getSettings()
                    setSettings(data)
                } catch (error) {
                    setToastMessage({
                        title: "Failed to load settings information", 
                        description: "We couldn't retrieve your settings data. Please try again later.", 
                        success: false
                    })
                }
            }else{
                setSettings(null)
            }
        })()
    }, [isAuthenticated, getSettings, setToastMessage])

    return (
        <SettingsContext.Provider value={{settings, setSettings}}>
            {children}
        </SettingsContext.Provider>
    )
}