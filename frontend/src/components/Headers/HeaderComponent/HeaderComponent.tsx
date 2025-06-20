import React, { useContext } from 'react'
import styles from "./HeaderComponent.module.css"
import { PiMagnifyingGlass, PiBell, PiEnvelopeSimple, PiUser, PiList } from "react-icons/pi";
import { UserContext } from '../../../contexts/UserContext';
import { NavLink } from 'react-router';


type Props = {
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderComponent = ({setOpenMenu}: Props) => {
    const { currentUser } = useContext(UserContext)

    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <div className={`${styles.containerIcon} ${styles.menuContainerIcon}`} onClick={() => setOpenMenu(current => !current)}>
                    <PiList className={styles.icon} />
                </div>
                <div className={styles.container}>
                    <form className={styles.form}>
                        <div className={styles.inputContainer}>
                            <input className={styles.input} type="text" placeholder='Search for something' />
                            <div className={styles.containerSearchIcon}>
                                <PiMagnifyingGlass className={styles.icon} />
                            </div>
                        </div>
                    </form>
                </div>
                <span className={styles.helloText}>Hello, {currentUser?.name}</span>
                <div className={styles.containerFunc}>
                    <div className={`${styles.containerIcon} ${styles.noMobile}`}>
                        <PiEnvelopeSimple className={styles.icon} />
                    </div>
                    <div className={styles.containerIcon}>
                        <PiBell className={styles.icon} />
                    </div>
                    <NavLink className={`${styles.containerAccount} ${styles.noMobile}`} to="/dashboard/profile/">
                        <div className={styles.containerAccountHeader}>
                            <div className={`${styles.containerIcon} ${styles.containerAccountHeaderIcon}`} style={{backgroundColor: currentUser?.profile_color}}>
                                <PiUser className={styles.icon} />
                            </div>
                        </div>
                        {currentUser &&
                            <div className={styles.containerAccountBody}>
                                <span className={styles.containerAccountBodyTitle}>{currentUser.name}</span>
                                <span className={styles.containerAccountBodySubTitle}>{currentUser.email}</span>
                            </div>
                        }
                    </NavLink>
                </div>
            </div>
        </header>
    )
}

export default HeaderComponent