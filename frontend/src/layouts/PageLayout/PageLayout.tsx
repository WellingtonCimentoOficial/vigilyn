import React from 'react'
import styles from './PageLayout.module.css'

type Props = {
    title: string
    description: string
    children: React.ReactNode
    aside?: React.ReactElement
    content?: React.ReactElement
}

const PageLayout = ({title, description, children, aside, content}: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h3 className={styles.title}>{title}</h3>
                    <span className={styles.description}>{description}</span>
                </div>
                <div className={styles.headerContent}>
                    {content}
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.content}>
                    {children}
                </div>
                {aside &&
                    <div className={styles.aside}>
                        {aside}
                    </div>
                }
            </div>
        </div>
    )
}

export default PageLayout