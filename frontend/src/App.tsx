import React from "react";
import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router";
import Routes from "./routes";
import { ToastContextProvider } from "./contexts/ToastContext";
import { UserContextProvider } from "./contexts/UserContext";

function App(){
    return (
        <div className="App">
            <BrowserRouter>
                <AuthContextProvider>
                    <UserContextProvider>
                        <ToastContextProvider>
                            <Routes />
                        </ToastContextProvider>
                    </UserContextProvider>
                </AuthContextProvider>
            </BrowserRouter>
        </div>
    )
}

export default App