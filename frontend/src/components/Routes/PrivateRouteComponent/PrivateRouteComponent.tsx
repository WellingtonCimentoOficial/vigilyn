import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import { Outlet, useLocation, useNavigate } from 'react-router'
import LoaderLogoComponent from '../../Loaders/LoaderLogoComponent/LoaderLogoComponent'
import { UserContext } from '../../../contexts/UserContext'


const PrivateRoute = () => {
    const {isAuthenticated, isLoading} = useContext(AuthContext)
    const {userPermissions} = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    const pathPermissions: Record<string, string|null> = {
        "/dashboard/profile/": "view_user",
        "/dashboard/cameras/": "view_camera",
        "/dashboard/records/": "view_record",
        "/dashboard/users/": "view_all_users",
        "/dashboard/analytics/": null,
        "/dashboard/settings/": "view_settings",
    }
    const requiredPermission = pathPermissions[location.pathname]

    useEffect(() => {
        if(!isLoading && !isAuthenticated){
            navigate("/auth/sign-in/")
        }
    }, [isAuthenticated, isLoading, navigate])
    
    if(!isLoading && !isAuthenticated){
        return <LoaderLogoComponent />
    }

    if(!isLoading && requiredPermission && !userPermissions.has(requiredPermission)){
        navigate(-1)
    }
    
    return <Outlet />
}

export default PrivateRoute