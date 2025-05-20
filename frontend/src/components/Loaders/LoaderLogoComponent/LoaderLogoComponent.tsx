import React from 'react'
import styles from "./LoaderLogoComponent.module.css"
import LogoSimbolComponent from '../../Logos/LogoSimbolComponent/LogoSimbolComponent'

type Props = {}

const LoaderLogoComponent = (props: Props) => {
    return (
        <div className={styles.wrapper}>
            <LogoSimbolComponent className={styles.logo} />
        </div>
    )
}

export default LoaderLogoComponent