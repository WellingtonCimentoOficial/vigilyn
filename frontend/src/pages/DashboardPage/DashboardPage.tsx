import React, { useContext, useEffect, useState } from 'react'
import styles from './DashboardPage.module.css'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import ButtonComponent from '../../components/Buttons/ButtonComponent/ButtonComponent'
import { PiCamera } from "react-icons/pi";
import { ChartType } from '../../types/FrontendTypes'
import { CameraType, RecordType, UserType } from '../../types/BackendTypes'
import { useBackendRequests } from '../../hooks/useBackRequests'
import { ToastContext } from '../../contexts/ToastContext'
import SectionComponent from '../../components/Sections/SectionComponent/SectionComponent'
import { getMonthName } from '../../utils/utils'
import HalfCircleChartComponent from '../../components/Charts/HalfCircleChartComponent/HalfCircleChartComponent'
import BarPlusChartComponent from '../../components/Charts/BarPlusChartComponent/BarPlusChartComponent'
import CardTimeComponent from '../../components/Cards/CardTimeComponent/CardTimeComponent'
import CardComponent from '../../components/Cards/CardComponent/CardComponent';
import CameraBasicListComponent from '../../components/Lists/CameraBasicListComponent/CameraBasicListComponent';
import UserBasicListComponent from '../../components/Lists/UserBasicListComponent/UserBasicListComponent';


type Props = {}

const DashboardPage = (props: Props) => {
    const [cameras, setCameras] = useState<CameraType[]>([])
    const [system, setSystem] = useState<ChartType[]>([])
    const [timeIso, setTimeIso] = useState<string>("")
    const [storage, setStorage] = useState<ChartType[]>([])
    const [records, setRecords] = useState<RecordType[]>([])
    const [users, setUsers] = useState<UserType[]>([])

    const { getCameras, getSystem, getStorage, getRecords, getUsers } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)

    
    useEffect(() => {
        (async () => {
            try {
                const data = await getCameras()
                setCameras(data.data)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load cameras", 
                    "description": "We couldn't fetch the camera list. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [getCameras, setToastMessage])

    useEffect(() => {
        (async () => {
            try {
                const data = await getSystem()
                const dataChart: ChartType[] = [
                    {title: "Cpu", value: data.cpu.percent_used},
                    {title: "Ram", value: data.ram.percent_used},
                    {title: "Storage", value: data.storage.percent_used},
                ]
                setSystem(dataChart)
                setTimeIso(data.time)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load system", 
                    "description": "We couldn't fetch the system info. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [getSystem, setToastMessage])


    useEffect(() => {
        (async () => {
            try {
                const data = await getStorage()
                const dataChart: ChartType[] = data.map(item => ({
                    title: getMonthName(Number(item.month)).slice(0, 3), 
                    value: item.total
                }))
                setStorage(dataChart)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load storage", 
                    "description": "We couldn't fetch the storage info. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [getStorage, setToastMessage])

    useEffect(() => {
        (async () => {
            let recordsArr = []
            for(let i=0; i < cameras.length; i++){
                try {
                    const data = await getRecords(cameras[i].id)
                    recordsArr.push(...data)
                } catch (error) {
                    setToastMessage({
                        "title": "Failed to load records", 
                        "description": "We couldn't fetch the records data. Please try again later.", 
                        success: false
                    })
                }
            }
            setRecords(recordsArr)
        })()
    }, [cameras, getRecords, setToastMessage])

    useEffect(() => {
        (async () => {
            try {
                const data = await getUsers({limit: 4})
                setUsers(data.data)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load users", 
                    "description": "We couldn't fetch the users. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [getUsers, setToastMessage])

    return (
        <PageLayout 
            title='Dashboard' 
            description='Comprehensive summary and analysis of system monitoring operations and performance activities.'
            content={
                <div className={styles.header}>
                    <ButtonComponent 
                        icon={<PiCamera />} 
                        text="Manage cameras" 
                        filled 
                        path='/dashboard/cameras/'
                    />
                    <ButtonComponent 
                        text="Manage records"
                        path='/dashboard/records/'
                    />
                </div>
            }
        >
            <div className={styles.wrapper}>
                <div className={styles.section1}>
                    <CardComponent title='Cameras recording now' value={cameras.filter(camera => camera.pid != null).length} focus />
                    <CardComponent title='Total Cameras' value={cameras.length} />
                    <CardComponent title='Total Stopped Cameras' value={cameras.filter(camera => camera.pid === null).length} />
                    <CardComponent title='Total Records' value={records.length} />
                </div>
                <div className={styles.sectionContainer}>
                    <div className={styles.aside}>
                        <CameraBasicListComponent data={cameras.slice(0, 5)} />
                        {timeIso && <CardTimeComponent timeIso={timeIso} />}
                    </div>
                    <div className={styles.sectionWrapper}>
                        <div className={styles.sectionLayout}>
                            <SectionComponent title='Storage Analytics'>
                                <div className={styles.section2Body}>
                                    <BarPlusChartComponent data={storage} />
                                </div>
                            </SectionComponent>
                            <SectionComponent title='Resource use'>
                                <div className={styles.section2Body}>
                                    <HalfCircleChartComponent data={system} />
                                </div>
                            </SectionComponent>
                        </div>
                        <div className={styles.sectionLayout}>
                            <UserBasicListComponent data={users} />
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default DashboardPage