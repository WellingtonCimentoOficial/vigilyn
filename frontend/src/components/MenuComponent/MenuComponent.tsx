import React, { useContext } from 'react'
import styles from './MenuComponent.module.css'
import { NavLink, useNavigate } from 'react-router'
import { PiHouse, PiCamera, PiRecord, PiUser, PiDoorOpen, PiLifebuoy, PiGear, PiLock } from "react-icons/pi";
import LogoFullComponent from '../LogoFullComponent/LogoFullComponent';
import { useBackendRequests } from '../../hooks/useBackRequests';
import { AuthContext } from '../../contexts/AuthContext';


type Props = {}

type Item = {
    name: string,
    href: string,
    icon: React.ReactElement<any>
}
type Section = {
    name: string
    items: Item[]
}
type Data = Section[]

const MenuComponent = (props: Props) => {
    const { signOut } = useBackendRequests()
    const { tokens, clearSession } = useContext(AuthContext)

    const navigate = useNavigate()

    const data: Data = [
        {
            name: "MENU",
            items: [
                {
                    name: "Dashboard",
                    href: "/dashboard",
                    icon: <PiHouse />
                },
                {
                    name: "Cameras",
                    href: "/cameras",
                    icon: <PiCamera />
                },
                {
                    name: "Records",
                    href: "/records",
                    icon: <PiRecord />
                },
                {
                    name: "Users",
                    href: "/users",
                    icon: <PiUser />
                },
                {
                    name: "Permissions",
                    href: "/permissions",
                    icon: <PiLock />
                },
            ]
        },
        {
            name: "GENERAL",
            items: [
                {
                    name: "Settings",
                    href: "/settings",
                    icon: <PiGear />
                },
                {
                    name: "Help",
                    href: "/help",
                    icon: <PiLifebuoy />
                }
            ]
        }
    ] 

    const handleLogout = async () => {
        try {
            await signOut(tokens.refresh_token)
        } finally {
            clearSession()
            navigate("/auth/sign-in/")
        }
    }

    return (
        <div className={styles.wrapper}>
            <NavLink className={styles.header} to="/">
                <LogoFullComponent />
            </NavLink>
            <div className={styles.body}>
                <ul className={styles.listSection}>
                    {data.map((section, sectionIndex) => (
                        <li key={sectionIndex} className={styles.liSection}>
                            <div className={styles.liSectionHeader}>
                                <span className={styles.liSectionHeaderTitle}>{section.name.toUpperCase()}</span>
                            </div>
                            <div className={styles.liSectionBody}>
                                <ul className={styles.listItem}>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className={styles.liItem}>
                                            <NavLink to={item.href} className={({isActive}) => isActive ? `${styles.aItem} ${styles.active}` : styles.aItem}>
                                                {({ isActive }) => (
                                                    <>
                                                        {React.cloneElement(item.icon, {
                                                            className: `${styles.icon} ${isActive ? styles.active : ""}`,
                                                        })}
                                                        <span className={`${styles.text} ${isActive ? styles.active : ""}`}>{item.name}</span>
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    ))}
                                    {sectionIndex === 1 &&
                                        <li className={styles.liItem} onClick={handleLogout}>
                                            <div className={styles.aItem}>
                                                <PiDoorOpen className={styles.icon} />
                                                <span className={styles.text}>Logout</span>
                                            </div>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default MenuComponent