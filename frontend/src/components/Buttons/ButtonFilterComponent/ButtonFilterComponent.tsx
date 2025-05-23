import React from 'react'
import styles from "./ButtonFilterComponent.module.css"
import { PiFunnel } from "react-icons/pi";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string
    count: number
}

const ButtonFilterComponent = ({className, children, text, count, ...rest}: Props) => {
    return (
        <button className={`${styles.button} ${className}`} {...rest}>
            <PiFunnel className={styles.icon} />
            {text}
            <div className={styles.count}>{count}</div>
        </button>
    )
}

export default ButtonFilterComponent