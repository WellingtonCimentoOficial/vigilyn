import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from "./CamerasPage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import ButtonComponent from '../../components/Buttons/ButtonComponent/ButtonComponent'
import { PiPlus, PiTrash, PiPencilSimple, PiPlay, PiStop, PiArrowCounterClockwise } from "react-icons/pi";
import CheckBoxComponent from '../../components/Checkboxes/CheckBoxComponent/CheckBoxComponent';
import { CameraType } from '../../types/BackendTypes';
import { useBackendRequests } from '../../hooks/useBackRequests';
import { ToastContext } from '../../contexts/ToastContext';
import ButtonFilterComponent from '../../components/Buttons/ButtonFilterComponent/ButtonFilterComponent';
import SearchBarComponent from '../../components/Searches/SearchBarComponent/SearchBarComponent';
import ModalConfirmationComponent from '../../components/Modals/ModalConfirmationComponent/ModalConfirmationComponent';
import DropdownBasicComponent from '../../components/Dropdowns/DropdownBasicComponent/DropdownBasicComponent';
import ModalCameraComponent from '../../components/Modals/ModalCameraComponent/ModalCameraComponent';
import PaginatorComponent from '../../components/Paginators/PaginatorComponent/PaginatorComponent';

type Props = {}

const CamerasPage = (props: Props) => {
    const [cameras, setCameras] = useState<CameraType[]>([])
    const [checkedItems, setCheckedItems] = useState<{id: number, checked: boolean}[]>([])
    const [showOptions, setShowOptions] = useState<{id: number, show: boolean}[]>([])
    const [search, setSearch] = useState<string>("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [cameraIdToDelete, setCameraIdToDelete] = useState<number>(-1);
    const [cameraToUpdate, setCameraToUpdate] = useState<CameraType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)

    const [limit, setLimit] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalCount, setTotalCount] = useState<number>(0)

    const { 
        getCameras, 
        deleteCamera, 
        startCamera, 
        stopCamera, 
        getCamera, 
        restartCamera 
    } = useBackendRequests()
    
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
        setShowOptions(prev => 
            prev.map(item =>
                item.id === id ? {...item, show: value !== undefined ? value : !item.show} : item
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
            setTotalCount(current => current - 1)
        } catch (error) {
            setToastMessage({
                "title": "Failed to delete camera", 
                "description": "We couldn't delete the camera. Please try again later.", 
                success: false
            })
        }
        setIsLoading(false)
    }

    const handleStartCamera = async (camerId: number) => {
        setIsLoading(true)
        try {
            const data = await startCamera(camerId)
            setCameras(prev => [data, ...prev.filter(camera => camera.id !== camerId)])
            setToastMessage({
                "title": "Camera started successfully!", 
                "description": "The camera is recording everything now", 
                success: true
            })
        } catch (error) {
            setToastMessage({
                "title": "Failed to start camera", 
                "description": "We couldn't start the camera. Please try again later.", 
                success: false
            })
        }
        setIsLoading(false)
    }
    const handleStopCamera = async (camerId: number) => {
        setIsLoading(true)
        try {
            await stopCamera(camerId)
            setCameras(prev => 
                prev.map(camera => 
                    camera.id === camerId ?
                    {...camera, pid: null} :
                    camera
                )
            )
            setToastMessage({
                "title": "Camera stopped successfully!", 
                "description": "The camera is no longer recording now", 
                success: true
            })
        } catch (error) {
            setToastMessage({
                "title": "Failed to stop camera", 
                "description": "We couldn't stop the camera. Please try again later.", 
                success: false
            })
        }
        setIsLoading(false)
    }
    const handleRestartCamera = async (cameraId: number) => {
        setIsLoading(true)
        try {
            await restartCamera(cameraId)
            const data = await getCamera(cameraId)
            setCameras(prev => [data, ...prev.filter(camera => camera.id !== cameraId)])
            setToastMessage({
                "title": "Camera restarted successfully!", 
                "description": "The camera has been restarted.", 
                success: true
            })
        } catch (error) {
            setToastMessage({
                "title": "Failed to restart camera", 
                "description": "We couldn't restart the camera. Please try again later.", 
                success: false
            })
        }
        setIsLoading(false)
    }

    const handlePagination = useCallback((limit: number, currentPage: number) => {
        setLimit(limit)
        setCurrentPage(currentPage)
    }, [])

    const handleAddCamera = (camera: CameraType) => {
        if(cameras.length >= 10){
            setCameras(prev => [camera, ...prev.filter(item => item.id !== camera.id).slice(0, -1)])
        }else{
            setCameras(prev => [camera, ...prev.filter(item => item.id !== camera.id)])
        }
        setTotalCount(current => current + 1)
    }

    useEffect(() => {
        (async () => {
            try {
                const data = await getCameras({limit, page: currentPage, search: debouncedSearch})
                setTotalCount(data.total_count)
                setCameras(data.data)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load cameras", 
                    "description": "We couldn't fetch the camera list. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [limit, currentPage, debouncedSearch, getCameras, setToastMessage])

    useEffect(() => {
        setCheckedItems([
            {id: 999999999, checked: false}, 
            ...cameras.map(camera => ({id: camera.id, checked: false}))
        ])
        setShowOptions(cameras.map(camera => ({id: camera.id, show: false})))
    }, [cameras])

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 1000)
        return () => clearTimeout(timeout)
    }, [search])

    return (
        <PageLayout 
            title='Camera management' 
            description='Create, edit, delete, and manage settings for your cameras in a centralized and efficient way.'
            content={<ButtonComponent text='New camera' icon={<PiPlus />} filled onClick={() => {setCameraToUpdate(null);setShowModal(true)}} />}
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
                    {cameras.length > 0 ? (
                        <>
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
                                                {(() => {
                                                    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 35%)`
                                                    return <div className={styles.profileContainerIcon} style={{backgroundColor: randomColor}}>{camera.name[0]}</div>
                                                })()}
                                                {camera.name}
                                            </td>
                                            <td className={styles.td}>{camera.ip_address}</td>
                                            <td className={styles.td}>{camera.port}</td>
                                            <td className={styles.td}>{camera.username !== "" ? camera.username : "-"}</td>
                                            <td className={styles.td}>{camera.password !== "" ? camera.password : "-"}</td>
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
                                                <DropdownBasicComponent
                                                    data={[
                                                        {name: "Start", icon: <PiPlay />, disabled: camera.pid ? true : false, callback: () => handleStartCamera(camera.id)},
                                                        {name: "Stop", icon: <PiStop />, disabled: !camera.pid ? true : false, callback: () => handleStopCamera(camera.id)},
                                                        {name: "Restart", icon: <PiArrowCounterClockwise />, disabled: !camera.pid ? true : false, callback: () => handleRestartCamera(camera.id)},
                                                        {name: "Edit", icon: <PiPencilSimple />, callback: () => {setCameraToUpdate(camera);setShowModal(true)}},
                                                        {name: "Delete", icon: <PiTrash />, callback: () => {setCameraIdToDelete(camera.id);setShowConfirmation(true)}},
                                                    ]}
                                                    show={showOptions.find(item => item.id === camera.id)?.show ?? false}
                                                    callbackShow={(value) => handleShowOptions(camera.id, value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <PaginatorComponent 
                                currentPage={currentPage} 
                                totalCount={totalCount} 
                                callback={handlePagination} 
                            />
                        </>
                    ):(
                        <span style={{textAlign: "center"}}>nothing to see around here...</span>
                    )}
                </div>
            </div>
            <ModalConfirmationComponent 
                showModal={showConfirmation} 
                setShowModal={setShowConfirmation}
                callback={handleDeleteCamera}
            />
            <ModalCameraComponent 
                setShowModal={setShowModal}
                showModal={showModal} 
                data={cameraToUpdate || undefined}
                callback={handleAddCamera}
            />
        </PageLayout>
    )
}

export default CamerasPage