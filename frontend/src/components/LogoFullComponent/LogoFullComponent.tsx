import React from 'react'
import styles from "./LogoFullComponent.module.css"
import LogoSimbolComponent from '../LogoSimbolComponent/LogoSimbolComponent'
import LogoLetterComponent from '../LogoLetterComponent/LogoLetterComponent'

type Props = {
    className?: string
}

const LogoFullComponent = ({className}: Props) => {
    return (
        <div className={`${styles.header} ${className}`}>
            <LogoSimbolComponent className={styles.logoSimbol} />
            <LogoLetterComponent className={styles.logoLetter} />
        </div>
    )
}

export default LogoFullComponent