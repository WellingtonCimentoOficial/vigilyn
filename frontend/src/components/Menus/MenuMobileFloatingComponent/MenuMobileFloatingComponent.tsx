import React from 'react'
import styles from "./MenuMobileFloatingComponent.module.css"
import { PiUsers, PiHouse, PiRecord, PiCamera } from "react-icons/pi";
import { NavLink } from 'react-router';

type Props = {}
type Data = {
    name: string
    href: string
    icon: React.ReactElement<any>
}[]

const MenuMobileFloatingComponent = (props: Props) => {
    const data: Data = [
        {
            name: "Dashboard",
            href: "/dashboard/",
            icon: <PiHouse />
        },
        {
            name: "Cameras",
            href: "/dashboard/cameras/",
            icon: <PiCamera />
        },
        {
            name: "Records",
            href: "/dashboard/records/",
            icon: <PiRecord />
        },
        {
            name: "Profile",
            href: "/dashboard/users/",
            icon: <PiUsers />
        },
    ]
    return (
        <div className={styles.wrapper}>
            <ul className={styles.list}>
                {data.map((item, index) => (
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
                ))}
            </ul>
        </div>
    )
}

export default MenuMobileFloatingComponent