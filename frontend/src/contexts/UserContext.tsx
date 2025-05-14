import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useBackendRequests } from "../hooks/useBackRequests";
import { ToastContext } from "./ToastContext";
import { UserExtendedType } from "../types/BackendTypes";

type UserContextType = {
    currentUser: UserExtendedType | null
    setCurrentUser: React.Dispatch<React.SetStateAction<UserExtendedType | null>>
}

type Props = {
    children: React.ReactNode
}

const initialData: UserContextType = {
    currentUser: null,
    setCurrentUser: () => {}
}


export const UserContext = createContext<UserContextType>(initialData)

export const UserContextProvider = ({children}: Props) => {
    const [currentUser, setCurrentUser] = useState<UserExtendedType|null>(null)

    const { isAuthenticated } = useContext(AuthContext)
    const { setToastMessage } = useContext(ToastContext)
    const { getMe } = useBackendRequests()

    useEffect(() => {
        (async () => {
            if(isAuthenticated){
                try {
                    const data = await getMe()
                    setCurrentUser(data)
                } catch (error) {
                    setToastMessage({
                        title: "Failed to load user information", 
                        description: "We couldn't retrieve your user data. Please try again later.", 
                        success: false
                    })
                }
            }else{
                setCurrentUser(null)
            }
        })()
    }, [isAuthenticated, getMe, setToastMessage])

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}