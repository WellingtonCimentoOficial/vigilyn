import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from "./SettingsPage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import CheckBoxSwitchComponent from '../../components/Checkboxes/CheckBoxSwitchComponent/CheckBoxSwitchComponent'
import InputComponent from '../../components/Inputs/InputComponent/InputComponent'
import { ModalConfirmationData } from '../../types/FrontendTypes'
import TagStatusComponent from '../../components/Tags/TagStatusComponent/TagStatusComponent'
import { useBackendRequests } from '../../hooks/useBackRequests'
import { ToastContext } from '../../contexts/ToastContext'
import ButtonComponent from '../../components/Buttons/ButtonComponent/ButtonComponent'
import { pathRegex } from '../../utils/regex'
import { ErrorValidationType, SettingsType } from '../../types/BackendTypes'
import { PiFloppyDisk, PiStop, PiArrowCounterClockwise } from "react-icons/pi";
import { SettingsContext } from '../../contexts/SettingsContext'
import ModalConfirmationComponent from '../../components/Modals/ModalConfirmationComponent/ModalConfirmationComponent'

type Props = {}

const SettingsPage = (props: Props) => {
    const [saveDirectoryPath, setSaveDirectoryPath] = useState<string>("")
    const [saveDirectoryPathIsValid, setSaveDirectoryPathIsValid] = useState<boolean>(false)
    
    const [tmpDirectoryPath, setTmpDirectoryPath] = useState<string>("")
    const [tmpDirectoryPathIsValid, setTmpDirectoryPathIsValid] = useState<boolean>(false)
    
    const [segmentTime, setSegmentTime] = useState<number>(0)
    const [segmentTimeIsValid, setSegmentTimeIsValid] = useState<boolean>(false)

    const [updateAllowNotifications, setUpdateAllowNotifications] = useState(false)
    const [allowNotifications, setAllowNotifications] = useState<boolean>(false)
    const [requiresRestart, setRequiresRestart] = useState<boolean>(false)

    const [autoDeleteEnabled, setAutoDeleteEnabled] = useState<boolean>(false)
    const [updateAutoDeleteEnabled, setUpdateAutoDeleteEnabled] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [restartIsLoading, setRestartIsLoading] = useState<boolean>(false)
    const [stopIsLoading, setStopIsLoading] = useState<boolean>(false)

    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)
    const [getAgain, setGetAgain] = useState<boolean>(false)

    const [modalConfirmationData, setModalConfirmationData] = useState<ModalConfirmationData|null>(null)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const { setSettings, settings } = useContext(SettingsContext)
    
    const { getSettings, updateSettings, restartSystem, stopSystem } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)

    const handleSaveDirectoryPath = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSaveDirectoryPath(e.target.value)
        setSaveDirectoryPathIsValid(pathRegex.test(e.target.value))
        setWasSubmitted(false)
    }

    const handleTmpDirectoryPath = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTmpDirectoryPath(e.target.value)
        setTmpDirectoryPathIsValid(pathRegex.test(e.target.value))
        setWasSubmitted(false)
    }

    const handleSegmentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const number = Number(e.target.value)
        const isANumber = !isNaN(number) && Number.isInteger(number)
        setSegmentTime(prev => isANumber ? number : prev)
        setSegmentTimeIsValid(isANumber)
        setWasSubmitted(false)
    }

    const handleSetStates = useCallback((data: SettingsType) => {
        setSaveDirectoryPath(data.save_directory_path)
        setSaveDirectoryPathIsValid(true)

        setTmpDirectoryPath(data.tmp_directory_path)
        setTmpDirectoryPathIsValid(true)

        setSegmentTime(data.segment_time)
        setSegmentTimeIsValid(true)
        
        setAllowNotifications(data.allow_notifications)
        setAutoDeleteEnabled(data.auto_delete_enabled)
        setRequiresRestart(data.requires_restart)
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        if(saveDirectoryPathIsValid && tmpDirectoryPathIsValid && segmentTimeIsValid && !isLoading){
            try {
                const data = await updateSettings({
                    save_directory_path: saveDirectoryPath,
                    tmp_directory_path: tmpDirectoryPath,
                    segment_time: segmentTime
                })
                setSettings(data)
                setToastMessage({
                    "title": "Settings updated successfully!", 
                    "description": "The settings was updated successfully", 
                    success: true
                })
            } catch (error: any) {
                if(error.response?.status === 400){
                    const data: ErrorValidationType = error.response?.data
                    if("save_directory_path" in data.message){
                        setSaveDirectoryPathIsValid(false)
                        setToastMessage({
                            "title": "Save directory path invalid", 
                            "description": "The save directory path field is invalid", 
                            success: false
                        })
                    }else if("tmp_directory_path" in data.message){
                        setTmpDirectoryPathIsValid(false)
                        setToastMessage({
                            "title": "Temporary directory path invalid", 
                            "description": "The temporary directory path field is invalid", 
                            success: false
                        })

                    }else if("segment_time" in data.message){
                        setSegmentTimeIsValid(false)
                        setToastMessage({
                            "title": "Segment time invalid", 
                            "description": "The segment time field is invalid", 
                            success: false
                        })
                    }else{
                        setToastMessage({
                            "title": "Settings not updated", 
                            "description": "The settings was not updated.", 
                            success: false
                        })
                    }
                }else{
                    setToastMessage({
                        "title": "Settings not updated", 
                        "description": "The settings was not updated.", 
                        success: false
                    })
                }
                setWasSubmitted(true)
            }
        }else{
            setWasSubmitted(true)
        }
        setIsLoading(false)
    }

    const handleRestartSystem = async () => {
        setRestartIsLoading(true)
        try {
            await restartSystem()
            setGetAgain(true)
            setToastMessage({
                "title": "System restarted successfully!", 
                "description": "The system was restarted successfully.", 
                success: true
            })
        } catch (error) {
            setToastMessage({
                "title": "System not restarted", 
                "description": "The system was not restarted.", 
                success: false
            })
        }
        setRestartIsLoading(false)
    }

    const handleStopSystem = async () => {
        setStopIsLoading(true)
        try {
            await stopSystem()
            setGetAgain(true)
            setToastMessage({
                "title": "System stopped successfully!", 
                "description": "The system was stopped successfully.", 
                success: true
            })
        } catch (error) {
            setToastMessage({
                "title": "System not stopped", 
                "description": "The system was not stopped.", 
                success: false
            })
        }
        setStopIsLoading(false)
    }

    const handleRestartSystemConfirmation = () => {
        setModalConfirmationData({
            title: "Confirm restart",
            description: "Are you sure you want to restart the system? This action may interrupt active processes.",
            callback: handleRestartSystem
        })
        setShowConfirmation(true)
    }

    const handleStopSystemConfirmation = () => {
        setModalConfirmationData({
            title: "Confirm stop",
            description: "Are you sure you want to stop the system? This will terminate all active processes.",
            callback: handleStopSystem
        })
        setShowConfirmation(true)
    }

    useEffect(() => {
        if(settings){
            handleSetStates(settings)
        }
    }, [settings, handleSetStates])

    useEffect(() => {   
        (async () => {
            if(getAgain){
                setIsLoading(true)
                try {
                    const data = await getSettings()
                    setSettings(data)
                    setGetAgain(false)
                } catch (error) {
                    setToastMessage({
                        "title": "Failed to load settings", 
                        "description": "We couldn't fetch the settings data. Please try again later.", 
                        success: false
                    })
                }
                setIsLoading(false)
            }
        })()
    }, [getAgain, getSettings, setToastMessage, setSettings])

    useEffect(() => {
        (async () => {
            if(updateAllowNotifications){
                setIsLoading(true)
                try {
                    const data = await updateSettings({allow_notifications: allowNotifications})
                    setAllowNotifications(data.allow_notifications)
                    setUpdateAllowNotifications(false)
                } catch (error) {
                    setToastMessage({
                        "title": "Allow notifications not updated", 
                        "description": "The allow notifications was not updated.", 
                        success: false
                    })
                }
                setIsLoading(false)
            }
        })()
    }, [allowNotifications, updateAllowNotifications, setToastMessage, updateSettings])

    useEffect(() => {
        (async () => {
            if(updateAutoDeleteEnabled){
                setIsLoading(true)
                try {
                    const data = await updateSettings({auto_delete_enabled: autoDeleteEnabled})
                    setAutoDeleteEnabled(data.auto_delete_enabled)
                    setUpdateAutoDeleteEnabled(false)
                } catch (error) {
                    setToastMessage({
                        "title": "Auto delete not updated", 
                        "description": "The auto deletewas not updated.", 
                        success: false
                    })
                }
                setIsLoading(false)
            }
        })()
    }, [autoDeleteEnabled, updateAutoDeleteEnabled, setToastMessage, updateSettings])

    return (
        <PageLayout title='Settings' description="Access and update application settings, including preferences for notifications, video format, and storage paths.">
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className={styles.column}>
                        <form id='form' className={styles.section} onSubmit={handleSubmit}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>Export settings</span>
                            </div>
                            <div className={styles.sectionBody}>
                                <div className={styles.sectionBodyItem}>
                                    <div className={styles.sectionBodyItemHeader}>
                                        <div className={styles.sectionBodyItemHeaderContainer}>
                                            <span className={styles.sectionBodyItemTitle}>Save directory path</span>
                                        </div>
                                        <div className={styles.sectionBodyItemDescription}>You must provide the full directory path. Make sure the path exists and has the correct write permissions.</div>
                                    </div>
                                    <InputComponent
                                        type='text'
                                        name='save_directory_path'
                                        id='save_directory_path'
                                        placeholder='/home/user/save/tmp/'
                                        onChange={handleSaveDirectoryPath}
                                        value={saveDirectoryPath}
                                        error={!saveDirectoryPathIsValid && wasSubmitted}
                                        disabled={isLoading || restartIsLoading || stopIsLoading}
                                    />
                                </div>
                                <div className={styles.sectionBodyItem}>
                                    <div className={styles.sectionBodyItemHeader}>
                                        <div className={styles.sectionBodyItemHeaderContainer}>
                                            <span className={styles.sectionBodyItemTitle}>Temporary directory path</span>
                                        </div>
                                        <div className={styles.sectionBodyItemDescription}>You must provide the full directory path. Make sure the path exists and has the correct write permissions.</div>
                                    </div>
                                    <InputComponent
                                        type='text'
                                        name='tmp_directory_path'
                                        id='tmp_directory_path'
                                        placeholder='/home/user/save/'
                                        onChange={handleTmpDirectoryPath}
                                        value={tmpDirectoryPath}
                                        error={!tmpDirectoryPathIsValid && wasSubmitted}
                                        disabled={isLoading || restartIsLoading || stopIsLoading}
                                    />
                                </div>
                                <div className={styles.sectionBodyItem}>
                                    <div className={styles.sectionBodyItemHeader}>
                                        <div className={styles.sectionBodyItemHeaderContainer}>
                                            <span className={styles.sectionBodyItemTitle}>Segment time</span>
                                        </div>
                                        <div className={styles.sectionBodyItemDescription}>This setting defines how long each video segment should last. The value must be provided in seconds.</div>
                                    </div>
                                    <InputComponent
                                        type='number'
                                        name='segment_time'
                                        id='segment_time'
                                        placeholder='300'
                                        onChange={handleSegmentTime}
                                        value={segmentTime}
                                        error={!segmentTimeIsValid && wasSubmitted}
                                        disabled={isLoading || restartIsLoading || stopIsLoading}
                                    />
                                </div>
                                <ButtonComponent 
                                    text='Save changes' 
                                    filled 
                                    isLoading={isLoading && !updateAllowNotifications && !restartIsLoading && !stopIsLoading} 
                                    disabled={isLoading || restartIsLoading || stopIsLoading}
                                    form='form'
                                    icon={<PiFloppyDisk />}
                                />
                            </div>
                        </form>
                    </div>
                    <div className={styles.column}>
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>Notifications</span>
                            </div>
                            <div className={styles.sectionBody}>
                                <div className={styles.sectionBodyItem}>
                                    <div className={styles.sectionBodyItemHeader}>
                                        <div className={styles.sectionBodyItemHeaderContainer}>
                                            <span className={styles.sectionBodyItemTitle}>Email Notification</span>
                                        </div>
                                        <div className={styles.sectionBodyItemDescription}>Receive email notifications whenever a camera starts or stops recording.</div>
                                    </div>
                                    <CheckBoxSwitchComponent 
                                        size={3} 
                                        checked={allowNotifications}
                                        callback={(checked) => {setAllowNotifications(checked);setUpdateAllowNotifications(true)}}
                                        disabled={isLoading || restartIsLoading || stopIsLoading}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>Storage</span>
                            </div>
                            <div className={styles.sectionBody}>
                                <div className={styles.sectionBodyItem}>
                                    <div className={styles.sectionBodyItemHeader}>
                                        <div className={styles.sectionBodyItemHeaderContainer}>
                                            <span className={styles.sectionBodyItemTitle}>Auto Delete</span>
                                        </div>
                                        <div className={styles.sectionBodyItemDescription}>Automatically delete the oldest recordings when the storage limit is reached.</div>
                                    </div>
                                    <CheckBoxSwitchComponent 
                                        size={3} 
                                        checked={autoDeleteEnabled}
                                        callback={(checked) => {setAutoDeleteEnabled(checked);setUpdateAutoDeleteEnabled(true)}}
                                        disabled={isLoading || restartIsLoading || stopIsLoading}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>Settings state</span>
                            </div>
                            <div className={styles.sectionBody}>
                                <div className={styles.sectionBodyItem}>
                                    <div className={styles.sectionBodyItemHeader}>
                                        <div className={styles.sectionBodyItemHeaderContainer}>
                                            <span className={styles.sectionBodyItemTitle}>Requires restart</span>
                                            <TagStatusComponent 
                                                text={requiresRestart ? "Restart required" : "Up to date"} 
                                                success={!requiresRestart}
                                            />
                                        </div>
                                        <div className={styles.sectionBodyItemDescription}>This status shows if there are pending configuration changes. Restart the system to apply any updates.</div>
                                    </div>
                                    <ButtonComponent 
                                        text='Restart' 
                                        disabled={isLoading || restartIsLoading || stopIsLoading}
                                        isLoading={restartIsLoading} 
                                        onClick={handleRestartSystemConfirmation}
                                        icon={<PiArrowCounterClockwise />}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>System</span>
                            </div>
                            <div className={styles.sectionBody}>
                                <div className={styles.sectionBodyItem}>
                                    <div className={styles.sectionBodyItemHeader}>
                                        <div className={styles.sectionBodyItemHeaderContainer}>
                                            <div className={styles.sectionBodyItemHeaderContainer}>
                                                <span className={styles.sectionBodyItemTitle}>Stop system</span>
                                            </div>
                                        </div>
                                        <div className={styles.sectionBodyItemDescription}>Stops all running processes, including active camera recordings and background services. Use with caution.</div>
                                    </div>
                                    <ButtonComponent 
                                        text='Stop' 
                                        disabled={isLoading || restartIsLoading || stopIsLoading}
                                        isLoading={stopIsLoading}
                                        onClick={handleStopSystemConfirmation}
                                        icon={<PiStop />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modalConfirmationData &&
                <ModalConfirmationComponent 
                    title={modalConfirmationData.title}
                    description={modalConfirmationData.description}
                    showModal={showConfirmation} 
                    setShowModal={setShowConfirmation}
                    callback={async () => {modalConfirmationData.callback();setShowConfirmation(false)}}
                />
            }
        </PageLayout>
    )
}

export default SettingsPage