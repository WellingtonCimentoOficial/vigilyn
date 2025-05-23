import React, { useId } from 'react'
import styles from "./CheckBoxSwitchComponent.module.css"

type Props = {
    size: number
    checked: boolean
    callback?: (checked: boolean) => void
}

const CheckBoxSwitchComponent = ({checked, size, callback}: Props) => {
    const id = useId()
    return (
        <div className={styles.wrapper}>
            <input 
                className={`${styles.tgl} ${styles.tglLight}`} 
                id={id} 
                type="checkbox"
                checked={checked}
                onChange={(e) => callback && callback(e.target.checked)}
            />
            <label className={styles.tglBtn} style={{width: size ? `${size}em` : "3em", height: size ? `${size/2}em` : "1.5em"}} htmlFor={id}></label>
        </div>
    )
}

export default CheckBoxSwitchComponent