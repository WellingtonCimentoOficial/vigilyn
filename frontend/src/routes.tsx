import { Navigate, Route, Routes as RoutesRoute} from "react-router"
import DashboardPage from "./pages/DashboardPage/DashboardPage"
import MainLayout from "./layouts/MainLayout/MainLayout"
import SignInPage from "./pages/SignInPage/SignInPage"
import PrivateRoute from "./components/PrivateRouteComponent/PrivateRouteComponent"

function Routes(){
    return (
        <RoutesRoute>
            <Route path="/auth">
                <Route path="/auth/sign-in/" element={<SignInPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />}/>

            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                </Route>
            </Route>
        </RoutesRoute>
    )
}

export default Routes