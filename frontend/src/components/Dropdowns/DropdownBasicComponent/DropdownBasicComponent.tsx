import React, { useEffect, useRef } from 'react'
import styles from "./DropdownBasicComponent.module.css"
import { PiPlugs } from "react-icons/pi";

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
            const clickedOutside = containerRef.current && !containerRef.current.contains(e.target as Node)
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                if(clickedOutside && show){
                    callbackShow(false)
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [show, callbackShow])

    return (
        <div className={styles.containerOptions} ref={containerRef}>
            {icon ? (
                React.cloneElement(icon, {
                    className: icon.props.className ?? styles.containerOptionsIcon,
                    onClick: () => callbackShow()
                })
            ):(
                <PiPlugs className={styles.containerOptionsIcon} onClick={() => callbackShow()} />
            )}
            <div 
                className={`${styles.subContainerOptions} ${show ? styles.subContainerOptionsShow : ""}`} 
            >
                {data.map((item, index) => (
                    <div key={index} className={`${styles.option} ${item.disabled ? styles.optionDisabled : ""}`} onClick={() => {item.callback();callbackShow()}}>
                        {React.cloneElement(item.icon, {className: `${styles.optionIcon} ${item.icon.props.className}`, style: item.icon.props.style})}
                        <span className={styles.optionText}>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DropdownBasicComponent