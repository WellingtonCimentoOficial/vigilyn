import React from 'react'
import styles from "./MenuMobileFloatingComponent.module.css"
import { PiMagnifyingGlass, PiBell, PiEnvelopeSimple, PiUser, PiList } from "react-icons/pi";
import { NavLink } from 'react-router';

type Props = {}

const MenuMobileFloatingComponent = (props: Props) => {
    return (
        <div className={styles.wrapper}>
            <ul className={styles.list}>
                <li className={styles.listLi}>
                    <div className={styles.containerIcon}>
                        <PiMagnifyingGlass className={styles.icon} />
                    </div>
                </li>
                <li className={styles.listLi}>
                    <div className={styles.containerIcon}>
                        <PiBell className={styles.icon} />
                    </div>
                </li>
                <li className={styles.listLi}>
                    <div className={styles.containerIcon}>
                        <PiEnvelopeSimple className={styles.icon} />
                    </div>
                </li>
                <li className={styles.listLi}>
                    <NavLink className={`${styles.containerIcon} ${styles.containerUser}`} to="/dashboard/profile/">
                        <PiUser className={styles.icon} />
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default MenuMobileFloatingComponent