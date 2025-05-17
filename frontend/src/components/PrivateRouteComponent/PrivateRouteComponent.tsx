import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Outlet, useNavigate } from 'react-router'
import LoaderLogoComponent from '../LoaderLogoComponent/LoaderLogoComponent'


const PrivateRoute = () => {
    const {isAuthenticated, isLoading} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoading && !isAuthenticated){
            navigate("/auth/sign-in/")
        }
    }, [isAuthenticated, navigate])
    
    if(!isLoading && !isAuthenticated){
        return <LoaderLogoComponent />
    }
    
    return <Outlet />
}

export default PrivateRoute