import React from 'react'
import styles from "./InputComponent.module.css"
import { PiEye, PiEyeSlash } from "react-icons/pi";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean
    label?: string
    showPassword?: boolean
    setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>
}

const InputComponent = ({error, className, id, label, type, showPassword, placeholder, disabled, setShowPassword, ...rest}: Props) => {
    return (
        <div className={styles.wrapper}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <div className={`${styles.inputWra} ${disabled ? styles.inputWraDisabled : ""}`}>
                <input 
                    className={`${styles.input} ${error ? styles.inputError : ""}`} 
                    id={id}
                    type={type}
                    placeholder={!placeholder && type === "password" ? "********" : placeholder}
                    disabled={disabled}
                    {...rest}
                />
                {setShowPassword &&
                    <div className={styles.inputIconContainer}>
                        {showPassword ? (
                            <PiEyeSlash className={styles.inputIcon} onClick={() => setShowPassword(value => !value)} />
                        ):(
                            <PiEye className={styles.inputIcon} onClick={() => setShowPassword(value => !value)} />
                        )}
                    </div>
                }
            </div>
        </div>
    )
}

export default InputComponent