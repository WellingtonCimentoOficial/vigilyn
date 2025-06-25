import React, { useContext } from 'react'
import styles from "./MenuMobileFloatingComponent.module.css"
import { PiUsers, PiHouse, PiRecord, PiCamera } from "react-icons/pi";
import { NavLink } from 'react-router';
import { UserContext } from '../../../contexts/UserContext';

type Props = {}
type Data = {
    name: string
    href: string
    icon: React.ReactElement<any>
    permission: null | string
}[]

const MenuMobileFloatingComponent = (props: Props) => {
    const {userPermissions} = useContext(UserContext)

    const data: Data = [
        {
            name: "Dashboard",
            href: "/dashboard/",
            icon: <PiHouse />,
            permission: null
        },
        {
            name: "Cameras",
            href: "/dashboard/cameras/",
            icon: <PiCamera />,
            permission: "view_camera"
        },
        {
            name: "Records",
            href: "/dashboard/records/",
            icon: <PiRecord />,
            permission: "view_record"
        },
        {
            name: "Profile",
            href: "/dashboard/users/",
            icon: <PiUsers />,
            permission: "view_all_users"
        },
    ]
    return (
        <div className={styles.wrapper}>
            <ul className={styles.list}>
                {data.map((item, index) => {
                    if(!item.permission || userPermissions.has(item.permission)){
                        return (
                            <li key={index} className={styles.listLi}>
                                <NavLink 
                                    className={({isActive}) => `${styles.containerIcon} ${isActive ? styles.active : ""}`} 
                                    to={item.href} 
                                    end={item.href === "/dashboard/"}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {React.cloneElement(item.icon, {className: `${styles.icon} ${isActive ? styles.active : ""}`})}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        )
                    }
                    return null
                })}
            </ul>
        </div>
    )
}

export default MenuMobileFloatingComponent