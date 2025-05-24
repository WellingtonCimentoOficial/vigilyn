import React from 'react'
import styles from "./TagStatusComponent.module.css"

type Props = {
    text: string
    success?: boolean
    className?: string
}

const TagStatusComponent = ({success, text, className}: Props) => {
    return (
        <span className={`${styles.status} ${success ? styles.success : styles.error} ${className}`}>
            {text}
        </span>
    )
}

export default TagStatusComponent