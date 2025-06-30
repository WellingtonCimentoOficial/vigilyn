import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from "./CardThumbnailComponent.module.css"
import { PiPlay, PiHeart, PiHeartFill, PiArrowDown, PiPencil, PiTrash, PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { RecordType } from '../../../types/BackendTypes';
import { formatDateTime, formatDuration } from '../../../utils/utils';
import DropdownBasicComponent from '../../Dropdowns/DropdownBasicComponent/DropdownBasicComponent';
import { useBackendRequests } from '../../../hooks/useBackRequests';
import { ToastContext } from '../../../contexts/ToastContext';
import ModalConfirmationComponent from '../../Modals/ModalConfirmationComponent/ModalConfirmationComponent';
import { ModalConfirmationData } from '../../../types/FrontendTypes';
import { UserContext } from '../../../contexts/UserContext';
import ModalRecordComponent from '../../Modals/ModalRecordComponent/ModalRecordComponent';
import LoaderThreePointsComponent from '../../Loaders/LoaderThreePointsComponent/LoaderThreePointsComponent';

type Props = {
    record: RecordType
    callback: (recordId: number) => void
    onClick: () => void
}


const CardThumbnailComponent = ({record, callback, onClick}: Props) => {
    const [recordLocal, setRecordLocal] = useState<RecordType>(record)
    const [showOptions, setShowOptions] = useState<boolean>(false)
    const [modalConfirmationData, setModalConfirmationData] = useState<ModalConfirmationData|null>(null)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [thumbnailUrl, setThumbnailUrl] = useState<string|null>(null)
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { getRecordThumbnail, downloadRecord, deleteRecord, updateFavorite } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)
    const { currentUser, userPermissions, setCurrentUser } = useContext(UserContext)

    const handleDownload = async () => {
        try {
            setToastMessage({
                title: "Download requested", 
                description: "Download has been requested. Please wait for it to begin.", 
                success: true
            })

            const url = await downloadRecord(recordLocal.id)
            const link = document.createElement("a")
            
            link.href = url
            link.setAttribute("download", recordLocal.name)
            
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            
            setToastMessage({
                title: "Download started", 
                description: "The download has started. If it doesn't begin automatically, please try again or check your connection.", 
                success: true
            })
        } catch (error) {
            setToastMessage({
                title: "Download failed",
                description: "We couldn’t fetch the record. Please try again later.",
                success: false
            })
        }
    }

    const handleDelete = async () => {
        try {
            await deleteRecord(recordLocal.id)
            callback(recordLocal.id)
            setToastMessage({
                "title": "Record deleted successfully!", 
                "description": "The record has been removed from your list.", 
                success: true
            })
        } catch (error: any) {
            if(error.response?.status === 403 && error.response?.data.error === "permission_denied"){
                setToastMessage({
                    title: "Failed to delete records",
                    description: "You do not have permission to delete a recording.",
                    success: false
                })
            }else{
                setToastMessage({
                    "title": "Failed to delete record", 
                    "description": "We couldn't delete the record. Please try again later.", 
                    success: false
                })
            }
        }
    }

    const handleDeleteConfirmation = () => {
        setModalConfirmationData({
            title: "Confirm deletion",
            description: "Are you sure you want to delete the selected item(s)? This action cannot be undone.",
            callback: handleDelete
        })
        setShowConfirmation(true)
    }

    const handleFavorite = useCallback(async () => {
        if(currentUser){
            if(currentUser.favorite.records.some(recordId => recordId === recordLocal.id)){
                try {
                    const data = await updateFavorite(currentUser.favorite.records.filter(record_id => record_id !== recordLocal.id))
                    setCurrentUser(data)
                    setToastMessage({
                        title: "Removed from favorites",
                        description: "The item was successfully removed from your favorites.",
                        success: true
                    })
                } catch (error) {
                    setToastMessage({
                        title: "Failed to remove from favorites",
                        description: "We couldn't remove this item from your favorites. Please try again later.",
                        success: false
                    })
                }
            }else{
                try {
                    const data = await updateFavorite([...currentUser.favorite.records, recordLocal.id])
                    setCurrentUser(data)
                    setToastMessage({
                        title: "Added to favorites",
                        description: "This record has been successfully added to your favorites.",
                        success: true
                    })
                } catch (error) {
                    setToastMessage({
                        title: "Failed to add to favorites", 
                        description: "We couldn't add this record to your favorites. Please try again later.", 
                        success: false
                    })
                }
            }
        }
    }, [currentUser, recordLocal, setCurrentUser, setToastMessage, updateFavorite])

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            try {
                const data = await getRecordThumbnail(recordLocal.id)
                setThumbnailUrl(data)
            } catch (error) {
                
            }
            setIsLoading(false)
        })()
    }, [recordLocal, getRecordThumbnail])

    useEffect(() => {
        if(currentUser){
            setIsFavorite(currentUser.favorite.records.some(recordId => recordId === recordLocal.id))
        }
    }, [currentUser, recordLocal])

    useEffect(() => setRecordLocal(record), [record])

    return (
        <div className={styles.wrapper}>
            <div className={styles.containerImage} onClick={onClick}>
                {!isLoading ? (
                    <>
                        {thumbnailUrl && <img className={styles.image} src={thumbnailUrl} alt={recordLocal.name} />}
                        <div className={styles.containerIcon}>
                            <div className={styles.subContainerIcon}>
                                <PiPlay className={styles.icon} />
                            </div>
                        </div>
                        <div className={styles.duration}>{formatDuration(recordLocal.duration_seconds)}</div>
                    </>
                ):(
                    <LoaderThreePointsComponent filled />
                )}
            </div>
            <div className={styles.body}>
                <div className={styles.containerData} onClick={onClick}>
                    <span className={styles.title}>{recordLocal.name}</span>
                    <div className={styles.containerInfo}>
                        <div className={styles.infoItem}>
                            <span className={styles.descriptionBold}>Format:</span>
                            <span className={styles.description}>{recordLocal.format}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.descriptionBold}>Recorded at:</span>
                            <span className={styles.description}>{formatDateTime(recordLocal.created_at)}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.optionsContainer}>
                    <DropdownBasicComponent
                        data={[
                            {
                                name: isFavorite ? "Remove from favorites" : "Add to favorites", 
                                icon: isFavorite ? <PiHeartFill style={{fill: "red"}} /> : <PiHeart />, 
                                disabled: false, 
                                callback: handleFavorite
                            },
                            {name: "Download recording", icon: <PiArrowDown />, disabled: !userPermissions.has("download_record"), callback: handleDownload},
                            {name: "Edit recording name", icon: <PiPencil />, disabled: false, callback: () => setShowModal(true)},
                            {name: "Delete recording", icon: <PiTrash />, disabled: !userPermissions.has("delete_record"), callback: handleDeleteConfirmation},
                        ]}
                        show={showOptions}
                        callbackShow={() => setShowOptions(current => !current)}
                        icon={<PiDotsThreeOutlineVerticalFill className={styles.optionsIcon} />}
                    />
                </div>
            </div>
            <ModalRecordComponent 
                setShowModal={setShowModal}
                showModal={showModal} 
                data={recordLocal}
                callback={(record) => setRecordLocal(record)}
            />
            {modalConfirmationData &&
                <ModalConfirmationComponent 
                    title={modalConfirmationData.title}
                    description={modalConfirmationData.description}
                    showModal={showConfirmation} 
                    setShowModal={setShowConfirmation}
                    callback={async () => {modalConfirmationData.callback();setShowConfirmation(false)}}
                />
            }
        </div>
    )
}

export default CardThumbnailComponent