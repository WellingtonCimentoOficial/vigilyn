import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from "./DropdownFilterRecordsComponent.module.css"
import ButtonFilterComponent from '../../Buttons/ButtonFilterComponent/ButtonFilterComponent'
import DropdownCalendarComponent from '../DropdownCalendarComponent/DropdownCalendarComponent'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'
import CheckBoxSwitchComponent from '../../Checkboxes/CheckBoxSwitchComponent/CheckBoxSwitchComponent'
import InputHourFilterComponent from '../../Inputs/InputHourFilterComponent/InputHourFilterComponent'
import { useBackendRequests } from '../../../hooks/useBackRequests'
import { ToastContext } from '../../../contexts/ToastContext'
import { CameraType } from '../../../types/BackendTypes'
import CheckBoxComponent from '../../Checkboxes/CheckBoxComponent/CheckBoxComponent'

type CallbackProps = {
    showFavorites: boolean
    initialDate: Date
    finalDate: Date
    initialHour: string
    finalHour: string
    camerasSelected: number[]
}
type Props = {
    show: boolean
    initialDate: Date
    finalDate: Date
    initialHour: string
    finalHour: string
    camerasSelected: number[]
    showFavorites: boolean
    isLoading?: boolean
    callbackShow: (value?: boolean) => void
    callback: ({showFavorites, initialDate, finalDate, initialHour, finalHour}: CallbackProps) => void
}

const DropdownFilterRecordsComponent = ({show, isLoading, initialDate, finalDate, initialHour, finalHour, showFavorites, camerasSelected, callback, callbackShow}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [showInitialCalendar, setShowInitialCalendar] = useState<boolean>(false)
    const [showFinalCalendar, setShowFinalCalendar] = useState<boolean>(false)
    const [initialDateFilter, setInitialDateFilter] = useState<Date>(initialDate)
    const [finalDateFilter, setFinalDateFilter] = useState<Date>(finalDate)
    const [initialHourFilter, setInitialHourFiltler] = useState<string>(initialHour.replace(/\D/g, ''))
    const [finalHourFilter, setFinalHourFilter] = useState<string>(finalHour.replace(/\D/g, ''))
    const [showFavoritesFilter, setShowFavoritesFilter] = useState<boolean>(showFavorites)
    const [filtersActiveCount, setFiltersActiveCount] = useState<number>(0)
    const [apply, setApply] = useState<boolean>(false)
    const [applyIsLoading, setApplyIsLoading] = useState<boolean>(false)
    const [resetIsLoading, setResetIsLoading] = useState<boolean>(false)
    const [cameras, setCameras] = useState<CameraType[]>([])
    const [camerasFilter, setCamerasFilter] = useState<number[]>(camerasSelected)

    const { getCameras } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)

    const handleCamerasFilter = (cameraId: number, checked: boolean) => {
        setCamerasFilter(prevIds =>
            checked ? [...prevIds, cameraId] : prevIds.filter(id => id !== cameraId)
        )       
    }

    const handleDisableFilters = () => {
        setInitialDateFilter(new Date())
        setFinalDateFilter(new Date())
        setInitialHourFiltler("000000")
        setFinalHourFilter("235959")
        setShowFavoritesFilter(false)
        setResetIsLoading(true)
        setCamerasFilter([])
        setApply(true)
    }

    const handleChangeHour = (prev: string, value: string) => {
        const raw = value.replace(/\D/g, '')
        const trimmed = raw.slice(-6)

        return trimmed
    }

    const handleFormatHour = (value: string) => {
        const padded = value.padStart(6, '0').slice(-6)

        let h = padded.slice(0, 2)
        let m = padded.slice(2, 4)
        let s = padded.slice(4, 6)

        return `${h}:${m}:${s}`
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                callbackShow(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [callbackShow])

    useEffect(() => {
        setFiltersActiveCount(2)
        const filters = [showFavoritesFilter]
        for(let i=0;i < filters.length;i++){
            if(filters[i]){
                setFiltersActiveCount(current => current + 1)
            }
        }
    }, [showFavoritesFilter])

    useEffect(() => {
        if(apply){
            callback({
                showFavorites: showFavoritesFilter,
                initialDate: initialDateFilter,
                finalDate: finalDateFilter,
                initialHour: handleFormatHour(initialHourFilter),
                finalHour: handleFormatHour(finalHourFilter),
                camerasSelected: camerasFilter
            })
            setApply(false)
        }
    }, [showFavoritesFilter, initialDateFilter, finalDateFilter, initialHourFilter, finalHourFilter, camerasFilter, apply, callback])

    useEffect(() => {
        if(!isLoading && (applyIsLoading || resetIsLoading)){
            setApplyIsLoading(false)
            setResetIsLoading(false)
            callbackShow(false)
        }
    }, [isLoading, applyIsLoading, resetIsLoading, callbackShow])

    useEffect(() => {
        (async () => {
            try {
                const data = await getCameras()
                setCameras(data.data)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load cameras", 
                    "description": "We couldn't fetch the cameras data. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [getCameras, setToastMessage])

    return (
        <div className={styles.containerOptions} ref={containerRef}>
            <ButtonFilterComponent 
                text='Filters' 
                count={filtersActiveCount}
                onClick={() => callbackShow()}
            />
            <div className={`${styles.subContainerOptions} ${show ? styles.subContainerOptionsShow : ""}`} >
                <div className={styles.option}>
                    <span className={styles.optionText}>Date range</span>
                    <div className={styles.calendarRange}>
                        <div className={styles.calendarContainer}>
                            <span className={styles.calendarText}>From:</span>
                            <DropdownCalendarComponent
                                show={showInitialCalendar}
                                data={initialDateFilter}
                                disabled={resetIsLoading || applyIsLoading}
                                callbackShow={(value) => setShowInitialCalendar(current => value ?? !current)} 
                                callback={(value) => setInitialDateFilter(value)}
                            />
                        </div>
                        <div className={styles.calendarContainer}>
                            <span className={styles.calendarText}>To:</span>
                            <DropdownCalendarComponent 
                                show={showFinalCalendar} 
                                data={finalDateFilter}
                                disabled={resetIsLoading || applyIsLoading}
                                callbackShow={(value) => setShowFinalCalendar(current => value ?? !current)} 
                                callback={(value) => setFinalDateFilter(value)}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.option}>
                    <span className={styles.optionText}>Hour range</span>
                    <div className={styles.calendarRange}>
                        <div className={styles.calendarContainer}>
                            <span className={styles.calendarText}>From:</span>
                            <InputHourFilterComponent 
                                maxLength={9}
                                value={handleFormatHour(initialHourFilter)} 
                                onChange={(e) => setInitialHourFiltler(prev => handleChangeHour(prev, e.target.value))}
                            />
                        </div>
                        <div className={styles.calendarContainer}>
                            <span className={styles.calendarText}>To:</span>
                            <InputHourFilterComponent 
                                maxLength={9}
                                value={handleFormatHour(finalHourFilter)} 
                                onChange={(e) => setFinalHourFilter(prev => handleChangeHour(prev, e.target.value))}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.option}>
                    <span className={styles.optionText}>Favorites</span>
                    <div className={styles.containerCheck}>
                        <div className={styles.checkText}>Show favorites</div>
                        <CheckBoxSwitchComponent 
                            checked={showFavoritesFilter} 
                            callback={() => setShowFavoritesFilter(current => !current)}
                            size={3}
                            disabled={resetIsLoading || applyIsLoading}
                        />
                    </div>
                </div>
                <div className={styles.option}>
                    <span className={styles.optionText}>Cameras</span>
                    <div className={styles.containerCameras}>
                        {cameras?.map(camera => (
                            <CheckBoxComponent 
                                key={camera.id}
                                label={camera.name} 
                                checked={camerasFilter.includes(camera.id)} 
                                callback={(checked) => handleCamerasFilter(camera.id, checked)}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.option}>
                    <div className={styles.bottom}>
                        <ButtonComponent 
                            className={styles.button}
                            text="Reset all"
                            disabled={resetIsLoading || filtersActiveCount === 0}
                            isLoading={resetIsLoading}
                            onClick={() => filtersActiveCount > 0 && handleDisableFilters()}
                        />
                        <ButtonComponent 
                            className={styles.button}
                            text="Apply now"
                            disabled={applyIsLoading}
                            isLoading={applyIsLoading}
                            filled
                            onClick={() => {setApply(true);setApplyIsLoading(true)}}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DropdownFilterRecordsComponent