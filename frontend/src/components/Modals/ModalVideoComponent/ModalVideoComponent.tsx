import React, { useEffect, useState } from 'react'
import styles from "./ModalVideoComponent.module.css"
import ModalBaseComponent from '../ModalBaseComponent/ModalBaseComponent'
import { RecordType } from '../../../types/BackendTypes'
import { useBackendRequests } from '../../../hooks/useBackRequests'

type Props = {
    showModal: boolean
    data: RecordType
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    // callback: (record: RecordType) => void
}

const ModalVideoComponent = ({data, showModal, setShowModal}: Props) => {
    const [videoUrl, setVideoUrl] = useState<string>()
    const { getRecordVideo } = useBackendRequests()


    useEffect(() => {
        (async () => {
            try {
                const urlVideo = await getRecordVideo(data.id)
                setVideoUrl(urlVideo)
            } catch (error) {
                
            }
        })()
    }, [data, getRecordVideo])

    return (
        <ModalBaseComponent
            title={data.name}
            description="View the full recording captured by the security system below."
            showModal={showModal} 
            setShowModal={setShowModal}>
            <video className={styles.video} controls>
                <source src={videoUrl} type={`video/${data.format}`} />
                Your browser does not support HTML5 video with H.265.
            </video>
        </ModalBaseComponent>
    )
}

export default ModalVideoComponent