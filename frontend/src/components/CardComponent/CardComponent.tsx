import React from 'react'
import styles from './CardComponent.module.css'
import { PiArrowUpRight, PiArrowUp, PiArrowDown } from "react-icons/pi";
import { NavLink } from 'react-router';


type Props = {
    focus?: boolean
    title: string
    value: number
}

const CardComponent = ({title, value, focus}: Props) => {
    return (
        <NavLink className={`${styles.wrapper} ${focus ? styles.focusBackground : ""}`} to="/">
            <div className={styles.header}>
                <span className={`${styles.title} ${focus ? styles.focusText : ""}`}>{title}</span>
                <div className={`${styles.containerHeaderIcon} ${!focus ? styles.focusText : ""}`}>
                    <PiArrowUpRight className={styles.headerIcon} />
                </div>
            </div>
            <div className={styles.body}>
                <span className={`${styles.bodyText} ${focus ? styles.focusText : ""}`}>{value}</span>
            </div>
            <div className={styles.footer}>
                <div className={styles.footerContainerIcon}>
                    {value === 0 ? (
                        <PiArrowDown className={`${styles.footerIcon} ${styles.down}`} />
                    ):(
                        <PiArrowUp className={`${styles.footerIcon} ${styles.up}`} />
                    )}
                </div>
                {value === 0 ? (
                    <span className={`${styles.footerText} ${styles.down}`}>No data at the moment.</span>
                ):(
                    <span className={`${styles.footerText} ${styles.up}`}>Activity detected during this period.</span>
                )}
            </div>
        </NavLink>
    )
}

export default CardComponent