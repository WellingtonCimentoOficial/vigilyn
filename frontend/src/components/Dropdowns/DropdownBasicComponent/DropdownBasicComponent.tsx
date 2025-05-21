import React from 'react'
import styles from "./DropdownBasicComponent.module.css"
import { PiDotsThree } from "react-icons/pi";

type DataType = {
    name: string
    icon: React.ReactElement<any>
    disabled?: boolean
    callback: () => void
}

type Props = {
    data: DataType[]
    show: boolean
    callbackShow: (value?: boolean) => void
}

const DropdownBasicComponent = ({data, show, callbackShow}: Props) => {
    return (
        <div className={styles.containerOptions} tabIndex={1} onBlur={() => callbackShow(false)}>
            <PiDotsThree className={styles.containerOptionsIcon} onClick={() => callbackShow()} />
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