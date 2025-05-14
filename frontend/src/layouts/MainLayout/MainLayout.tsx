import React from 'react'
import { Outlet } from 'react-router'
import styles from './MainLayout.module.css'
import MenuComponent from '../../components/MenuComponent/MenuComponent'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'

type Props = {}

const MainLayout = (props: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.sideNav}>
                <MenuComponent />
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <HeaderComponent />
                </div>
                <div className={styles.body}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainLayout