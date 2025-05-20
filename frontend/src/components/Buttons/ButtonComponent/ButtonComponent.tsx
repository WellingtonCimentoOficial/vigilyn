import React from 'react'
import styles from './ButtonComponent.module.css'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string
    icon?: React.ReactElement<any>
    filled?: boolean
    className?: string
    disabled?: boolean
    isLoading?: boolean
}

const ButtonComponent = ({icon, text, filled, className, disabled, isLoading, ...rest}: Props) => {
    return (
        <button className={`${styles.wrapper} ${filled ? styles.filled : ""} ${className}`} disabled={disabled} {...rest}>
            {!isLoading ? (
                <>
                    {icon &&
                        <div className={styles.containerIcon}>
                            {React.cloneElement(icon, {className: `${styles.icon} ${filled ? styles.filledText : ""}`})}
                        </div>
                    }
                    <span className={`${styles.text} ${filled ? styles.filledText : ""}`}>{text}</span>
                </>

            ):(
                <div className={styles.containerLoader}>
                    <div className={styles.loader}></div>
                    <div className={styles.loader}></div>
                    <div className={styles.loader}></div>
                </div>
            )}
        </button>
    )
}

export default ButtonComponent