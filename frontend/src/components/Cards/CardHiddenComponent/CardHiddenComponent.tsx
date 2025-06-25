import React from 'react'
import styles from "./CardHiddenComponent.module.css"
import { PiEyeSlash } from "react-icons/pi";


type Props = {}

const CardHiddenComponent = (props: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <PiEyeSlash className={styles.icon} />
                <span className={styles.text}>You do not have permission to view this information</span>
            </div>
        </div>
    )
}

export default CardHiddenComponent