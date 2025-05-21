import React, { useEffect } from 'react'
import styles from "./ModalBaseComponent.module.css"
import { PiX } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion"

type Props = {
    title: string
    description: string
    children: React.ReactNode
    footer?: React.ReactNode
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalBaseComponent = ({title, description, children, footer, showModal, setShowModal}: Props) => {

    useEffect(() => {
        if(showModal){
            document.body.style.overflow = "hidden"
            document.documentElement.style.overflow = "hidden"
        }else{
            document.body.style.overflow = "auto"
            document.documentElement.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
            document.documentElement.style.overflow = "auto"
        }
    }, [showModal])

    return (
        <AnimatePresence>
            {showModal &&
                <motion.div 
                    className={styles.wrapper}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.3}}
                >
                    <motion.div 
                        className={styles.container}
                        initial={{y: -20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -20, opacity: 0}}
                        transition={{duration: 0.3}}
                    >
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
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default ModalBaseComponent