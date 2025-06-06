import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import styles from './MainLayout.module.css'
import MenuComponent from '../../components/Menus/MenuComponent/MenuComponent'
import HeaderComponent from '../../components/Headers/HeaderComponent/HeaderComponent'
import { AnimatePresence, motion } from "framer-motion"
import MenuMobileFloatingComponent from '../../components/Menus/MenuMobileFloatingComponent/MenuMobileFloatingComponent'

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
            <AnimatePresence>
                {openMenu &&
                    <motion.div 
                        className={styles.sideNav}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MenuComponent setOpenMenu={setOpenMenu} />
                    </motion.div>
                }
            </AnimatePresence>
            <div className={styles.main}>
                <div className={styles.header}>
                    <HeaderComponent setOpenMenu={setOpenMenu} />
                </div>
                <div className={styles.body}>
                    <Outlet />
                </div>
                <div className={styles.footer}>
                    <MenuMobileFloatingComponent />
                </div>
            </div>
        </div>
    )
}

export default MainLayout