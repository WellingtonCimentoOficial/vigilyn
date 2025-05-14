import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Outlet, useNavigate } from 'react-router'


const PrivateRoute = () => {
    const {isAuthenticated} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(!isAuthenticated){
            navigate("/auth/sign-in/")
        }
    }, [isAuthenticated, navigate])
    
    return <Outlet />
}

export default PrivateRoute