import React from 'react'
import styles from './ButtonComponent.module.css'

type Props = {
    text: string
    icon?: React.ReactElement<any>
    callback?: () => {}
    filled?: boolean
    className?: string
    disabled?: boolean
}

const ButtonComponent = ({icon, text, callback, filled, className, disabled}: Props) => {
    return (
        <button className={`${styles.wrapper} ${filled ? styles.filled : ""} ${className}`} disabled={disabled} onClick={callback}>
            {icon &&
                <div className={styles.containerIcon}>
                    {React.cloneElement(icon, {className: `${styles.icon} ${filled ? styles.filledText : ""}`})}
                </div>
            }
            <span className={`${styles.text} ${filled ? styles.filledText : ""}`}>{text}</span>
        </button>
    )
}

export default ButtonComponent