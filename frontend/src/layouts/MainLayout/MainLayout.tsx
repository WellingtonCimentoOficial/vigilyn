import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import styles from './MainLayout.module.css'
import MenuComponent from '../../components/Menus/MenuComponent/MenuComponent'
import HeaderComponent from '../../components/Headers/HeaderComponent/HeaderComponent'

type Props = {}

const MainLayout = (props: Props) => {
    const [openMenu, setOpenMenu] = useState<boolean>(false)

    const handleResize = () => {
        if(window.innerWidth > 870){
            setOpenMenu(true)
        }else{
            setOpenMenu(false)
        }
    }

    useEffect(handleResize, [])

    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className={styles.wrapper}>
            {openMenu &&
                <div className={styles.sideNav}>
                    <MenuComponent setOpenMenu={setOpenMenu} />
                </div>
            }
            <div className={styles.main}>
                <div className={styles.header}>
                    <HeaderComponent setOpenMenu={setOpenMenu} />
                </div>
                <div className={styles.body}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainLayout