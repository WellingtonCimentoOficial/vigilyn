import React from 'react'
import styles from "./ButtonFilterComponent.module.css"
import { PiFunnel } from "react-icons/pi";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string
}

const ButtonFilterComponent = ({className, children, text, ...rest}: Props) => {
    return (
        <button className={`${styles.button} ${className}`} {...rest}>
            <PiFunnel className={styles.icon} />
            {text}
            <div className={styles.count}>0</div>
        </button>
    )
}

export default ButtonFilterComponent