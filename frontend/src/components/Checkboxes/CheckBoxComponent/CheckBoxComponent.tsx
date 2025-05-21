import React, {useId} from 'react'
import styles from "./CheckBoxComponent.module.css"

type Props = {
    label?: string
    checked: boolean
    callback?: (checked: boolean) => void
    className?: string
}

const CheckBoxComponent = ({label, checked, className, callback}: Props) => {
    const id = useId()
    return (
        <div className={`${styles.wrapper} ${className}`}>
            <input 
                id={id} 
                className={styles.input} 
                type="checkbox"
                checked={checked} 
                onChange={(e) => callback && callback(e.target.checked)}
            />
            <label className={styles.label} htmlFor={id}>
                <span>
                    <svg width="12px" height="10px">
                        <use xlinkHref='#check-4'></use>
                    </svg>
                </span>
                {label && <span className={styles.labelText}>{label}</span>}
            </label>
            <svg className={styles.inlineSvg}>
                <symbol id="check-4" viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </symbol>
            </svg>
      </div>
   
    )
}

export default CheckBoxComponent