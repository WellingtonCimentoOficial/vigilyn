import React from 'react'
import styles from "./InputHourFilterComponent.module.css"
import { PiClock } from "react-icons/pi";

type Props = React.InputHTMLAttributes<HTMLInputElement>

const InputHourFilterComponent = ({type="text", ...rest}: Props) => {
    return (
        <div className={styles.wrapper}>
            <input className={styles.input} type={type} {...rest} />
            <PiClock className={styles.icon} />
        </div>
    )
}

export default InputHourFilterComponent