import { createContext, useEffect, useState } from "react";
import ToastComponent from "../components/ToastComponent/ToastComponent";
import { ToastType } from "../types/FrontendTypes";


type ToastContextType = {
    toastMessage: ToastType | null
    setToastMessage: React.Dispatch<React.SetStateAction<ToastType | null>>
}

const initalData: ToastContextType = {
    toastMessage: null,
    setToastMessage: () => {}
}

type Props = {
    children: React.ReactNode
}

export const ToastContext = createContext<ToastContextType>(initalData)

export const ToastContextProvider = ({children}: Props) => {
    const [toastMessage, setToastMessage] = useState<ToastType|null>(null)

    useEffect(() => {
        if(toastMessage){
            const timeout = setTimeout(() => setToastMessage(null), 10000)
            return () => clearTimeout(timeout)
        }
    }, [toastMessage])

    return (
        <ToastContext.Provider value={{toastMessage, setToastMessage}}>
            <ToastComponent 
                title={toastMessage?.title ?? ""} 
                description={toastMessage?.description ?? ""} 
                success={toastMessage?.success ?? false}
                show={toastMessage ? true : false}
            />
            {children}
        </ToastContext.Provider>
    )
}