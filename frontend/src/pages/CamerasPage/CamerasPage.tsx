import React, { useContext, useEffect, useState } from 'react'
import styles from "./CamerasPage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import ButtonComponent from '../../components/Buttons/ButtonComponent/ButtonComponent'
import { PiPlus, PiDotsThree, PiTrash, PiPencilSimple } from "react-icons/pi";
import CheckBoxComponent from '../../components/CheckBoxComponent/CheckBoxComponent';
import { CameraType } from '../../types/BackendTypes';
import { useBackendRequests } from '../../hooks/useBackRequests';
import { ToastContext } from '../../contexts/ToastContext';
import ButtonFilterComponent from '../../components/Buttons/ButtonFilterComponent/ButtonFilterComponent';
import SearchBarComponent from '../../components/Searches/SearchBarComponent/SearchBarComponent';
import ModalConfirmationComponent from '../../components/Modals/ModalConfirmationComponent/ModalConfirmationComponent';

type Props = {}

const CamerasPage = (props: Props) => {
    const [cameras, setCameras] = useState<CameraType[]>([])
    const [checkedItems, setCheckedItems] = useState<{id: number, checked: boolean}[]>([])
    const [showOptions, setShowOptions] = useState<{id: number, show: boolean}[]>([])
    const [search, setSearch] = useState<string>("")
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [cameraIdToDelete, setCameraIdToDelete] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { getCameras, deleteCamera } = useBackendRequests()
    
    const { setToastMessage } = useContext(ToastContext)

    const handleCheckAll = (checked: boolean) => {
        setCheckedItems(prev => 
            prev.map(item => ({...item, checked: checked}))
        )
    }

    const handleCheck = (id: number, checked: boolean) => {
        setCheckedItems(prev => 
            prev.map(item =>
                item.id === id ? {...item, checked: checked} : item
            )
        )
    }

    const handleShowOptions = (id: number, value?: boolean) => {
        console.log("aaaa")
        setShowOptions(prev => 
            prev.map(item =>
                item.id === id ? {...item, show: value ? value : !item.show} : item
            )
        )
    }

    const handleDeleteCamera = async () => {
        setIsLoading(true)
        try {
            await deleteCamera(cameraIdToDelete)
            setCameras(prev => prev.filter(camera => camera.id !== cameraIdToDelete))
            setToastMessage({
                "title": "Camera deleted successfully!", 
                "description": "The camera has been removed from your list.", 
                success: true
            })
            setCameraIdToDelete(-1)
        } catch (error) {
            setToastMessage({
                "title": "Failed to delete camera", 
                "description": "We couldn't delete the camera. Please try again later.", 
                success: false
            })
        }
        setIsLoading(false)
    }

    useEffect(() => {
        (async () => {
            try {
                const data = await getCameras()
                setCameras(data)
                setCheckedItems([
                    {id: 999999999, checked: false}, 
                    ...data.map(camera => ({id: camera.id, checked: false}))
                ])
                setShowOptions(data.map(camera => ({id: camera.id, show: false})))
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load cameras", 
                    "description": "We couldn't fetch the camera list. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [getCameras, setToastMessage])

    return (
        <PageLayout 
            title='Camera management' 
            description='Create, edit, delete, and manage settings for your cameras in a centralized and efficient way.'
            content={<ButtonComponent text='New camera' icon={<PiPlus />} filled />}
        >
            <div className={styles.wrapper}>
                <div className={styles.containerHeader}>
                    <SearchBarComponent value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className={styles.containerFilters}>
                        <CheckBoxComponent 
                            className={styles.checkboxFilter} 
                            label={`${checkedItems.filter(item => item.id !== 999999999 && item.checked).length} selected`}
                            checked
                        />
                        <ButtonFilterComponent text='Filters' />
                    </div>
                </div>
                <div className={styles.container}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr className={styles.tr}>
                                <th className={styles.th}>
                                    <CheckBoxComponent 
                                        checked={checkedItems.find(item => item.id === 999999999)?.checked ?? false} 
                                        callback={(checked) => handleCheckAll(checked)} 
                                    />
                                </th>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Ip Address</th>
                                <th className={styles.th}>Port</th>
                                <th className={styles.th}>Username</th>
                                <th className={styles.th}>Password</th>
                                <th className={styles.th}>Path</th>
                                <th className={`${styles.th} ${styles.textCenter}`}>Status</th>
                                <th className={`${styles.th} ${styles.textCenter}`}>Settings State</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {cameras.map(camera => (
                                <tr key={camera.id} className={styles.tr}>
                                    <th className={styles.th}>
                                        <CheckBoxComponent 
                                            checked={checkedItems.find(item => item.id === camera.id)?.checked ?? false} 
                                            callback={(checked) => handleCheck(camera.id, checked)} 
                                        />
                                    </th>
                                    <td className={`${styles.td} ${styles.profile}`}>
                                        <div className={styles.profileContainerIcon}>{camera.name[0]}</div>
                                        {camera.name}
                                    </td>
                                    <td className={styles.td}>{camera.ip_address}</td>
                                    <td className={styles.td}>{camera.port}</td>
                                    <td className={styles.td}>{camera.username}</td>
                                    <td className={styles.td}>{camera.password}</td>
                                    <td className={styles.td}>{camera.path}</td>
                                    <td className={`${styles.td} ${styles.textCenter}`}>
                                        <span className={`${styles.status} ${camera.pid ? styles.success : styles.error}`}>
                                            {camera.pid ? "Recording" : "Stopped"}
                                        </span>
                                    </td>
                                    <td className={`${styles.td} ${styles.textCenter}`}>
                                        <span className={`${styles.status} ${camera.requires_restart ? styles.error : styles.success}`}>
                                            {camera.requires_restart ? "Pending" : "Applied"}
                                        </span>
                                    </td>
                                    <td className={`${styles.td}`}>
                                        <div className={styles.containerOptions}>
                                            <PiDotsThree className={styles.containerOptionsIcon} onClick={() => handleShowOptions(camera.id)} />
                                            <div 
                                                className={`${styles.subContainerOptions} ${showOptions.find(item => item.id === camera.id)?.show ? styles.subContainerOptionsShow : ""}`} 
                                            >
                                                <div className={styles.option}>
                                                    <PiPencilSimple className={styles.optionIcon} />
                                                    <span className={styles.optionText}>Edit</span>
                                                </div>
                                                <div className={styles.option} onClick={() => {setCameraIdToDelete(camera.id);setShowConfirmation(true)}}>
                                                    <PiTrash className={styles.optionIcon} />
                                                    <span className={styles.optionText}>Delete</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ModalConfirmationComponent 
                showModal={showConfirmation} 
                setShowModal={setShowConfirmation}
                callback={handleDeleteCamera}
            />
        </PageLayout>
    )
}

export default CamerasPage