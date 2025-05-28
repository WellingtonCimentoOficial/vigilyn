import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from "./RecordsPage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import CardThumbnailComponent from '../../components/Cards/CardThumbnailComponent/CardThumbnailComponent'
import { useBackendRequests } from '../../hooks/useBackRequests'
import { RecordType } from '../../types/BackendTypes'
import { ToastContext } from '../../contexts/ToastContext'

type Props = {}

const RecordsPage = (props: Props) => {
    const limit = 16
    const [totalPages, setTotalPages] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [records, setRecords] = useState<RecordType[]>([])

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const hasLoadedOnce = useRef(false)

    const { getRecords } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)

    const handleRemove = (recordId: number) => {
        setRecords(prev => prev.filter(item => item.id !== recordId))
    }

    useEffect(() => {
        (async () => {
            try {
                const data = await getRecords({limit: 16, page})
                setRecords(current => [...current, ...data.data])
                setTotalPages(Math.ceil(data.total_count / limit))
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load records", 
                    "description": "We couldn't fetch the records data. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [page, getRecords, setToastMessage])

    const observer = useMemo(() => {
        const obs = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting){
                if(!hasLoadedOnce.current){
                    hasLoadedOnce.current = true
                    return
                }
                setPage(current => {
                    const newValue = current + 1
                    if(newValue <= totalPages){
                        return newValue
                    }
                    return current
                })
            }
        })
        return obs
    }, [totalPages])

    useEffect(() => {
        const target = bottomRef.current

        if(target){
            observer.observe(target)
        }

        return () => {
            if(target){
                observer.unobserve(target)
            }
        }
    }, [observer])

    return (
        <PageLayout
            title='Records'
            description='Access, manage and review recorded video footage from surveillance cameras with playback and organizational tools.'
        >
            <div className={styles.wrapper}>
                <div className={styles.section1}>
                    {records.map(record => (
                        <div key={record.id} className={styles.containerThumb}>
                            <CardThumbnailComponent record={record} callback={handleRemove} />
                        </div>
                    ))}
                </div>
                <div ref={bottomRef} style={{height: 1}}></div>
            </div>
        </PageLayout>
    )
}

export default RecordsPage