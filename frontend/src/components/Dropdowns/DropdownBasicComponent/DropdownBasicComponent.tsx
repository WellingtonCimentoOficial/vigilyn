import React, { useEffect, useRef } from 'react'
import styles from "./DropdownBasicComponent.module.css"
import { PiDotsThree } from "react-icons/pi";

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

const DropdownBasicComponent = ({data, show, icon, callbackShow}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                callbackShow(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [callbackShow])

    return (
        <div className={styles.containerOptions} ref={containerRef}>
            {icon ? (
                React.cloneElement(icon, {
                    className: styles.containerOptionsIcon,
                    onClick: () => callbackShow()
                })
            ):(
                <PiDotsThree className={styles.containerOptionsIcon} onClick={() => callbackShow()} />
            )}
            <div 
                className={`${styles.subContainerOptions} ${show ? styles.subContainerOptionsShow : ""}`} 
            >
                {data.map((item, index) => (
                    <div key={index} className={`${styles.option} ${item.disabled ? styles.optionDisabled : ""}`} onClick={() => {item.callback();callbackShow()}}>
                        {React.cloneElement(item.icon, {className: styles.optionIcon})}
                        <span className={styles.optionText}>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DropdownBasicComponent