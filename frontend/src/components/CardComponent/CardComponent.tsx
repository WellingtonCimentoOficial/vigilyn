import React from 'react'
import styles from './CardComponent.module.css'
import { PiEnvelopeSimple, PiArrowUpRight } from "react-icons/pi";
import { NavLink } from 'react-router';


type Props = {
    focus?: boolean
    title: string
    description: string
}

const CardComponent = ({title, description, focus}: Props) => {
    return (
        <NavLink className={`${styles.wrapper} ${focus ? styles.focusBackground : ""}`} to="/">
            <div className={styles.header}>
                <span className={`${styles.title} ${focus ? styles.focusText : ""}`}>{title}</span>
                <div className={`${styles.containerHeaderIcon} ${!focus ? styles.focusText : ""}`}>
                    <PiArrowUpRight className={styles.headerIcon} />
                </div>
            </div>
            <div className={styles.body}>
                <span className={`${styles.bodyText} ${focus ? styles.focusText : ""}`}>{description}</span>
            </div>
            <div className={styles.footer}>
                <div className={styles.footerContainerIcon}>
                    <PiEnvelopeSimple className={styles.footerIcon} />
                </div>
                <span className={styles.footerText}>Incresed from last month</span>
            </div>
        </NavLink>
    )
}

export default CardComponent