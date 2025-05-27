import React from 'react'
import styles from "./RecordsPage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import CardSummaryComponent from '../../components/Cards/CardSummaryComponent/CardSummaryComponent'

type Props = {}

const RecordsPage = (props: Props) => {
    return (
        <PageLayout
            title='Records'
            description='Access, manage and review recorded video footage from surveillance cameras with playback and organizational tools.'
        >
            <div className={styles.wrapper}>
                <div className={styles.section1}>
                    <CardSummaryComponent />
                </div>
            </div>
        </PageLayout>
    )
}

export default RecordsPage