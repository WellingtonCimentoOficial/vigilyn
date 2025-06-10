import React, { useContext, useEffect, useState } from 'react'
import styles from './MenuComponent.module.css'
import { NavLink, useNavigate } from 'react-router'
import { PiHouse, PiCamera, PiRecord, PiUsers, PiDoorOpen, PiLifebuoy, PiGear, PiChartLineUpLight, PiArrowCircleLeft, PiArrowCircleRight, PiX } from "react-icons/pi";
import { useBackendRequests } from '../../../hooks/useBackRequests';
import { AuthContext } from '../../../contexts/AuthContext';
import LogoFullComponent from '../../Logos/LogoFullComponent/LogoFullComponent';
import LogoSimbolComponent from '../../Logos/LogoSimbolComponent/LogoSimbolComponent';

type Props = {
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>
}

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

const MenuComponent = ({setOpenMenu}: Props) => {
    const { signOut } = useBackendRequests()
    const { tokens, clearSession } = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState<boolean>(true)

    const navigate = useNavigate()

    const data: Data = [
        {
            name: "MENU",
            items: [
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
                    name: "Users",
                    href: "/dashboard/users/",
                    icon: <PiUsers />
                },
                {
                    name: "Analytics",
                    href: "/dashboard/analytics/",
                    icon: <PiChartLineUpLight />
                },
            ]
        },
        {
            name: "GENERAL",
            items: [
                {
                    name: "Settings",
                    href: "/dashboard/settings/",
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

    const handleOpenMenu = (value: boolean) => {
        if(window.innerWidth <= 870){
            setOpenMenu(value)
        }
    }

    const handleOpenClose = (value: string) => {
        if(value === "open"){
            setIsOpen(true)
        }else{
            setIsOpen(false)
        }
        localStorage.setItem("menu", value)
    }

    const handleResize = () => {
        if(window.innerWidth <= 870){
            setIsOpen(true)
        }else if(window.innerWidth <= 1115){
            setIsOpen(false)
        }else{
            const menu = localStorage.getItem("menu")
            if(menu){
                if(menu === "open"){
                    setIsOpen(true)
                }else{
                    setIsOpen(false)
                }
            }
        }
    }

    useEffect(() => handleResize(), [])

    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (

        <div className={`${styles.wrapper} ${!isOpen ? styles.wrapperClosed : ""}`}>
            <div className={`${styles.header} ${!isOpen ? styles.headerClosed : ""}`}>
                <NavLink className={styles.containerLogo} to="/">
                    {isOpen ? <LogoFullComponent /> : <LogoSimbolComponent className={styles.logo} />}
                </NavLink>
                {isOpen && <PiArrowCircleLeft className={styles.toggleIcon} onClick={() => handleOpenClose("close")} />}
                {isOpen && <PiX className={styles.toggleIconMobile} onClick={() => setOpenMenu(false)} />}
            </div>
            <div className={styles.body}>
                <ul className={`${styles.listSection} ${!isOpen ? styles.listSectionClosed : ""}`}>
                    {data.map((section, sectionIndex) => (
                        <li key={sectionIndex} className={`${styles.liSection} ${!isOpen ? styles.liSectionClosed : ""}`}>
                            <div className={styles.liSectionHeader}>
                                <span className={`${styles.liSectionHeaderTitle} ${!isOpen ? styles.liSectionHeaderTitleClosed : ""}`}>{section.name.toUpperCase()}</span>
                            </div>
                            <div className={styles.liSectionBody}>
                                <ul className={styles.listItem}>
                                    {sectionIndex === 0 && !isOpen &&
                                        <li className={`${styles.liItem} ${styles.toggleIconOpen}`} onClick={() => handleOpenClose("open")}>
                                            <div className={`${styles.aItem} ${!isOpen ? styles.aItemClosed : ""}`}>
                                                <PiArrowCircleRight className={`${styles.icon} ${!isOpen ? styles.iconClosed : ""}`} />
                                            </div>
                                        </li>
                                    }
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className={styles.liItem}>
                                            <NavLink 
                                                to={item.href} 
                                                end={item.href === "/dashboard/"}
                                                className={({isActive}) => `${styles.aItem } ${!isOpen ? styles.aItemClosed : ""} ${isActive ? styles.active : ""}`}
                                                onClick={() => handleOpenMenu(false)}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {React.cloneElement(item.icon, {
                                                            className: `${styles.icon} ${!isOpen ? styles.iconClosed : ""} ${isActive ? styles.active : ""}`,
                                                        })}
                                                        <span className={`${styles.text} ${!isOpen ? styles.textClosed : ""} ${isActive ? styles.active : ""}`}>{item.name}</span>
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    ))}
                                    {sectionIndex === 1 &&
                                        <li className={styles.liItem} onClick={handleLogout}>
                                            <div className={`${styles.aItem} ${!isOpen ? styles.aItemClosed : ""}`}>
                                                <PiDoorOpen className={`${styles.icon} ${!isOpen ? styles.iconClosed : ""}`} />
                                                <span className={`${styles.text} ${!isOpen ? styles.textClosed : ""}`}>Logout</span>
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