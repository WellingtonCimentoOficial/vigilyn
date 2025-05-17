import React, { useContext } from 'react'
import styles from "./ToastComponent.module.css"
import { ToastType } from '../../types/FrontendTypes'
import { PiXBold, PiXCircle, PiCheckCircle } from "react-icons/pi";
import { ToastContext } from '../../contexts/ToastContext';

type Props = ToastType & {
    show: boolean
}

const ToastComponent = ({title, description, success, show}: Props) => {
    const {setToastMessage} = useContext(ToastContext)

    return (
        <div className={`${styles.wrapper} ${show ? styles.wrapperShow : ""}`}>
            <div className={`${styles.containerIcon} ${success ? styles.successContainer : styles.errorContainer}`}>
                {success ? (
                    <PiCheckCircle className={`${styles.icon} ${styles.success}`} />
                ):(
                    <PiXCircle className={`${styles.icon} ${styles.error}`} />
                )}
            </div>
            <div className={styles.containerMessage}>
                <div className={styles.containerHeader}>
                    <span className={styles.title}>{title.slice(0, 25)}</span>
                </div>
                <div className={styles.containerBody}>
                    <span className={styles.description}>{description.slice(0, 68)}</span>
                </div>
            </div>
            <div className={styles.containerClose}>
                <PiXBold className={styles.closeIcon} onClick={() => setToastMessage(null)} />
            </div>
        </div>
    )
}

export default ToastComponent