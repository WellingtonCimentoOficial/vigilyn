import React from 'react'
import styles from "./SectionComponent.module.css"
import CardHiddenComponent from '../../Cards/CardHiddenComponent/CardHiddenComponent'

type Props = {
    title?: string
    children: React.ReactNode
    content?: React.ReactNode
    hidden?: boolean
}

const SectionComponent = ({title, hidden, children, content}: Props) => {
    return (
        <div className={styles.wrapper}>
            {(title || content) &&
                <div className={styles.header}>
                    {title && <span className={styles.title}>{title}</span>}
                    {!hidden && content}
                </div>
            }
            {!hidden ? children : <CardHiddenComponent />}
        </div>
    )
}

export default SectionComponent