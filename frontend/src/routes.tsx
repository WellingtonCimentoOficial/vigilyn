import { Navigate, Route, Routes as RoutesRoute} from "react-router"
import DashboardPage from "./pages/DashboardPage/DashboardPage"
import MainLayout from "./layouts/MainLayout/MainLayout"
import SignInPage from "./pages/SignInPage/SignInPage"
import PrivateRoute from "./components/Routes/PrivateRouteComponent/PrivateRouteComponent"
import CamerasPage from "./pages/CamerasPage/CamerasPage"
import RecordsPage from "./pages/RecordsPage/RecordsPage"
import UsersPage from "./pages/UsersPage/UsersPage"
import RolesPage from "./pages/RolesPage/RolesPage"
import SettingsPage from "./pages/SettingsPage/SettingsPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"

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
                    <Route path="/dashboard/profile/" element={<ProfilePage />} />
                    <Route path="/dashboard/cameras/" element={<CamerasPage />} />
                    <Route path="/dashboard/records/" element={<RecordsPage />} />
                    <Route path="/dashboard/users/" element={<UsersPage />} />
                    <Route path="/dashboard/roles/" element={<RolesPage />} />
                    <Route path="/dashboard/settings/" element={<SettingsPage />} />
                </Route>
            </Route>
        </RoutesRoute>
    )
}

export default Routes