import React from 'react'
import styles from './ButtonComponent.module.css'
import { useNavigate } from 'react-router'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string
    icon?: React.ReactElement<any>
    filled?: boolean
    className?: string
    disabled?: boolean
    isLoading?: boolean
    path?: string
}

const ButtonComponent = ({icon, text, filled, className, disabled, isLoading, path, ...rest}: Props) => {
    const navigate = useNavigate()
    return (
        <button 
            className={`${styles.wrapper} ${filled ? styles.filled : ""} ${className}`} 
            disabled={disabled} 
            onClick={() => path && navigate(path)}
            {...rest}
        >
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
                    <div className={`${styles.loader} ${filled ? styles.loaderFilled : ""}`}></div>
                    <div className={`${styles.loader} ${filled ? styles.loaderFilled : ""}`}></div>
                    <div className={`${styles.loader} ${filled ? styles.loaderFilled : ""}`}></div>
                </div>
            )}
        </button>
    )
}

export default ButtonComponent