import React from 'react'
import styles from "./SectionComponent.module.css"

type Props = {
    title?: string
    children: React.ReactNode
    content?: React.ReactNode
}

const SectionComponent = ({title, children, content}: Props) => {
    return (
        <div className={styles.wrapper}>
            {(title || content) &&
                <div className={styles.header}>
                    {title && <span className={styles.title}>{title}</span>}
                    {content}
                </div>
            }
            {children}
        </div>
    )
}

export default SectionComponent