import React from 'react'
import styles from './DashboardPage.module.css'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import CardComponent from '../../components/CardComponent/CardComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { PiPlus } from "react-icons/pi";
import BarPlusChartComponent from '../../components/BarPlusChartComponent/BarPlusChartComponent'
import { ChartType, CameraBasicListType, UserBasicListType } from '../../types/FrontendTypes'
import HalfCircleChartComponent from '../../components/HalfCircleChartComponent/HalfCircleChartComponent'
import UserBasicListComponent from '../../components/UserBasicListComponent/UserBasicListComponent'
import CameraBasicListComponent from '../../components/CameraBasicListComponent/CameraBasicListComponent'
import CardTimeComponent from '../../components/CardTimeComponent/CardTimeComponent'


type Props = {}

const DashboardPage = (props: Props) => {
    const camerasData: CameraBasicListType[] = [
        {
            id: 0,
            title: "Cam1",
            description: "192.168.0.181",
            url: "/"
        },
        {
            id: 1,
            title: "Cam112212121343gferfe",
            description: "192.168.0.181",
            url: "/"
        },
        {
            id: 2,
            title: "Cam1",
            description: "192.168.0.181",
            url: "/"
        },
        {
            id: 3,
            title: "Cam1",
            description: "192.168.0.181",
            url: "/"
        },
        {
            id: 4,
            title: "Cam1",
            description: "192.168.0.181",
            url: "/"
        },
    ]

    const usersData: UserBasicListType[] = [
        {
            id: 0,
            title: "Admin",
            description: "Admin, Operator",
            url: "/",
            status: {
                label: "Active",
                level: "high"
            }
        },
        {
            id: 1,
            title: "Cam112212121343gferfe",
            description: "192.168.0.181",
            url: "/",
            status: {
                label: "Active",
                level: "medium"
            }
        },
        {
            id: 2,
            title: "Cam1",
            description: "192.168.0.181",
            url: "/",
            status: {
                label: "Active",
                level: "low"
            }
        },
        {
            id: 3,
            title: "Cam1",
            description: "192.168.0.181",
            url: "/",
            status: {
                label: "Active",
                level: "high"
            }
        }
    ]
    
    const storageData: ChartType[] = [
        {
            title: "S",
            value: 10
        },
        {
            title: "T",
            value: 4
        },
        {
            title: "Q",
            value: 8
        },
        {
            title: "Q",
            value: 2
        },
        {
            title: "S",
            value: 9
        },
        {
            title: "S",
            value: 7
        },
    ]

    const resourceUseData: ChartType[] = [
        {
            title: "Cpu",
            value: 30
        },
        {
            title: "Ram",
            value: 65
        },
        {
            title: "Storage",
            value: 90
        },
    ]
    return (
        <PageLayout 
            title='Dashboard' 
            description='Comprehensive summary and analysis of system monitoring operations and performance activities.'
            content={
                <div className={styles.header}>
                    <ButtonComponent 
                        icon={<PiPlus />} 
                        text="Create camera" 
                        filled 
                    />
                    <ButtonComponent 
                        text="Import data" 
                    />
                </div>
            }
        >
            <div className={styles.wrapper}>
                <div className={styles.section1}>
                    <CardComponent title='Cameras recording now' description='4' focus />
                    <CardComponent title='Total Cameras' description='12' />
                    <CardComponent title='Total Stopped Cameras' description='5' />
                    <CardComponent title='Total Records' description='20' />
                </div>
                <div className={styles.sectionContainer}>
                    <div className={styles.aside}>
                        <div className={styles.container}>
                            <CameraBasicListComponent title='Cameras' data={camerasData} />
                        </div>
                        <CardTimeComponent />
                    </div>
                    <div className={styles.sectionWrapper}>
                        <div className={`${styles.sectionLayout} ${styles.section2}`}>
                            <div className={`${styles.container} ${styles.section2Container}`}>
                                <div className={styles.section2Header}>
                                    <h5 className={styles.section2HeaderTitle}>Storage Analytics</h5>
                                </div>
                                <div className={styles.section2Body}>
                                    <BarPlusChartComponent data={storageData} />
                                </div>
                            </div>
                            <div className={`${styles.container} ${styles.section2Container}`}>
                                <div className={styles.section2Header}>
                                    <h5 className={styles.section2HeaderTitle}>Resource use</h5>
                                </div>
                                <div className={styles.section2Body}>
                                    <HalfCircleChartComponent data={resourceUseData} />
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.sectionLayout} ${styles.section3}`}>
                            <div className={`${styles.container} ${styles.section3Container}`}>
                                <UserBasicListComponent title='Users' data={usersData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default DashboardPage