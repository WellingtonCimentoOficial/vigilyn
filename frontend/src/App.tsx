import React from "react";
import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router";
import Routes from "./routes";
import { ToastContextProvider } from "./contexts/ToastContext";
import { UserContextProvider } from "./contexts/UserContext";
import { SettingsContextProvider } from "./contexts/SettingsContext";

function App(){
    return (
        <div className="App">
            <BrowserRouter>
                <AuthContextProvider>
                    <ToastContextProvider>
                        <UserContextProvider>
                            <SettingsContextProvider>
                                <Routes />
                            </SettingsContextProvider>
                        </UserContextProvider>
                    </ToastContextProvider>
                </AuthContextProvider>
            </BrowserRouter>
        </div>
    )
}

export default App