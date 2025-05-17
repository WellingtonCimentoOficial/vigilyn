import React from 'react'
import styles from "./ModalBaseComponent.module.css"
import { PiX } from "react-icons/pi";


type Props = {
    title: string
    description: string
    children: React.ReactNode
    footer?: React.ReactNode
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalBaseComponent = ({title, description, children, footer, showModal, setShowModal}: Props) => {
    return (
        <div className={`${styles.wrapper} ${showModal ? styles.wrapperShow : ""}`}>
            <div className={`${styles.container} ${showModal ? styles.containerShow : ""}`}>
                <div className={styles.header}>
                    <div className={styles.headerContainer}>
                        <span className={styles.title}>{title}</span>
                        <span className={styles.description}>{description}</span>
                    </div>
                    <div className={styles.containerIcon} onClick={() => setShowModal(current => !current)}>
                        <PiX className={styles.icon} />
                    </div>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
                {footer &&
                    <div className={styles.footer}>
                        {footer}
                    </div>
                }
            </div>
        </div>
    )
}

export default ModalBaseComponent