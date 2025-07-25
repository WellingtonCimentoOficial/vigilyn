import React, { useEffect, useState } from 'react'
import styles from "./ModalVideoComponent.module.css"
import ModalBaseComponent from '../ModalBaseComponent/ModalBaseComponent'
import { RecordType } from '../../../types/BackendTypes'
import { useBackendRequests } from '../../../hooks/useBackRequests'
import LoaderThreePointsComponent from '../../Loaders/LoaderThreePointsComponent/LoaderThreePointsComponent'
import { BASE_URL } from '../../../hooks/useAxios'

type Props = {
    showModal: boolean
    data: RecordType
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalVideoComponent = ({data, showModal, setShowModal}: Props) => {
    const [token, setToken] = useState<string|null>(null)
    const { getRecordToken } = useBackendRequests()


    useEffect(() => {
        (async () => {
            try {
                const responseData = await getRecordToken(data.id)
                setToken(responseData.token)
            } catch (error) {
                
            }
        })()
    }, [data, getRecordToken])

    return (
        <ModalBaseComponent
            title={data.name}
            description="View the full recording captured by the security system below."
            showModal={showModal} 
            setShowModal={setShowModal}>
            {token ? (
                <video 
                    className={styles.video} 
                    controls 
                    autoPlay 
                    muted
                    playsInline 
                    preload='auto'
                >
                    <source src={`${BASE_URL}/records/${data.id}/video/?token=${token}`} type="video/mp4" />
                </video>
            ):(
                <div className={`${styles.containerLoader} ${styles.video}`}>
                    <LoaderThreePointsComponent />
                </div>
            )}
        </ModalBaseComponent>
    )
}

export default ModalVideoComponent