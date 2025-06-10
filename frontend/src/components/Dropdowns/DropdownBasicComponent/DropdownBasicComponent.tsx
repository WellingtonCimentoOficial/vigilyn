import React, { useEffect, useRef, useState } from 'react'
import styles from "./DropdownBasicComponent.module.css"
import { PiPlugs } from "react-icons/pi"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"

type DataType = {
    name: string
    icon: React.ReactElement<any>
    disabled?: boolean
    callback: () => void
}

type Props = {
    icon?: React.ReactElement<any>
    data: DataType[]
    show: boolean
    callbackShow: (value?: boolean) => void
}

const DropdownBasicComponent = ({ data, show, icon, callbackShow }: Props) => {
    const iconRef = useRef<HTMLDivElement>(null)
    const [coords, setCoords] = useState({ top: 0, right: 0 })

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (iconRef.current && !iconRef.current.contains(e.target as Node)) {
                if (show) {
                    callbackShow(false)
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [show, callbackShow])

    // Calcula a posição ao mostrar
    useEffect(() => {
        if (show && iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect()
            setCoords({ 
                top: rect.bottom + 5,
                right: window.innerWidth - rect.right
            })
        }
    }, [show])

    return (
        <>
            <div className={styles.containerOptions} ref={iconRef}>
                {icon ? (
                    React.cloneElement(icon, {
                        className: icon.props.className ?? styles.containerOptionsIcon,
                        onClick: () => callbackShow()
                    })
                ) : (
                    <PiPlugs className={styles.containerOptionsIcon} onClick={() => callbackShow()} />
                )}
            </div>
            {createPortal(
                <AnimatePresence>
                    {show && (
                        <motion.div
                            className={styles.subContainerOptions}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                position: "fixed",
                                top: coords.top,
                                right: coords.right,
                                zIndex: 9999,
                                transformOrigin: "top",
                            }}
                        >
                            {data.map((item, index) => (
                                <div
                                    key={index}
                                    className={`${styles.option} ${item.disabled ? styles.optionDisabled : ""}`}
                                    onClick={() => { item.callback(); callbackShow() }}
                                >
                                    {React.cloneElement(item.icon, {
                                        className: `${styles.optionIcon} ${item.icon.props.className}`,
                                        style: item.icon.props.style
                                    })}
                                    <span className={styles.optionText}>{item.name}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}

export default DropdownBasicComponent