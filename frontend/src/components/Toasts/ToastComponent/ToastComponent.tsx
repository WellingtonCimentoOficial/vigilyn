import React, { useContext } from 'react'
import styles from "./ToastComponent.module.css"
import { ToastType } from '../../../types/FrontendTypes'
import { PiXBold, PiXCircle, PiCheckCircle } from "react-icons/pi";
import { ToastContext } from '../../../contexts/ToastContext';
import { AnimatePresence, motion } from "framer-motion"

type Props = ToastType & {
    show: boolean
}

const ToastComponent = ({title, description, success, show}: Props) => {
    const {setToastMessage} = useContext(ToastContext)

    return (
        <AnimatePresence>
            {show &&
                <motion.div 
                    className={styles.wrapper}
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                    <div className={`${styles.containerIcon} ${success ? styles.successContainer : styles.errorContainer}`}>
                        {success ? (
                            <PiCheckCircle className={`${styles.icon} ${styles.success}`} />
                        ):(
                            <PiXCircle className={`${styles.icon} ${styles.error}`} />
                        )}
                    </div>
                    <div className={styles.containerMessage}>
                        <div className={styles.containerHeader}>
                            <span className={styles.title}>{title}</span>
                        </div>
                        <div className={styles.containerBody}>
                            <span className={styles.description}>{description}</span>
                        </div>
                    </div>
                    <div className={styles.containerClose}>
                        <PiXBold className={styles.closeIcon} onClick={() => setToastMessage(null)} />
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default ToastComponent