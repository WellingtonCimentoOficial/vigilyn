import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useBackendRequests } from "../hooks/useBackRequests";
import { ToastContext } from "./ToastContext";
import { UserProfileType } from "../types/BackendTypes";

type UserContextType = {
    currentUser: UserProfileType | null
    userPermissions: Set<string>
    setCurrentUser: React.Dispatch<React.SetStateAction<UserProfileType | null>>
}

type Props = {
    children: React.ReactNode
}

const initialData: UserContextType = {
    userPermissions: new Set(),
    currentUser: null,
    setCurrentUser: () => {}
}


export const UserContext = createContext<UserContextType>(initialData)

export const UserContextProvider = ({children}: Props) => {
    const [currentUser, setCurrentUser] = useState<UserProfileType|null>(null)
    const [userPermissions, setUserPermissions] = useState<Set<string>>(new Set())

    const { isAuthenticated } = useContext(AuthContext)
    const { setToastMessage } = useContext(ToastContext)
    const { getMe } = useBackendRequests()

    useEffect(() => {
        (async () => {
            if(isAuthenticated){
                try {
                    const data = await getMe()
                    setCurrentUser(data)
                    setUserPermissions(new Set(
                        data.roles.flatMap(role =>
                            role.permissions.map(permission => permission.name)
                        )
                    ))
                } catch (error) {
                    setToastMessage({
                        title: "Failed to load user information", 
                        description: "We couldn't retrieve your user data. Please try again later.", 
                        success: false
                    })
                }
            }else{
                setCurrentUser(null)
                setUserPermissions(new Set())
            }
        })()
    }, [isAuthenticated, getMe, setToastMessage])

    return (
        <UserContext.Provider value={{currentUser, userPermissions, setCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}