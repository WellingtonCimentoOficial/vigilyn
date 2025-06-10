import React from 'react'
import styles from "./LoaderThreePointsComponent.module.css"

type Props = {
    filled?: boolean
}

const LoaderThreePointsComponent = ({filled}: Props) => {
    return (
        <div className={styles.containerLoader}>
            <div className={`${styles.loader} ${filled ? styles.loaderFilled : ""}`}></div>
            <div className={`${styles.loader} ${filled ? styles.loaderFilled : ""}`}></div>
            <div className={`${styles.loader} ${filled ? styles.loaderFilled : ""}`}></div>
        </div>
    )
}

export default LoaderThreePointsComponent