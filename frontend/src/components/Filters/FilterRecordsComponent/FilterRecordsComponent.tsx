import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styles from "./FilterRecordsComponent.module.css"
import CheckBoxSwitchComponent from '../../Checkboxes/CheckBoxSwitchComponent/CheckBoxSwitchComponent'
import InputHourFilterComponent from '../../Inputs/InputHourFilterComponent/InputHourFilterComponent'
import { useBackendRequests } from '../../../hooks/useBackRequests'
import { ToastContext } from '../../../contexts/ToastContext'
import { CameraType } from '../../../types/BackendTypes'
import CheckBoxComponent from '../../Checkboxes/CheckBoxComponent/CheckBoxComponent'
import DropdownCalendarComponent from '../../Dropdowns/DropdownCalendarComponent/DropdownCalendarComponent'
import { RecordsFilterType } from '../../../types/FrontendTypes'

const FilterRecordsComponent = forwardRef(({isLoading, initialDate, finalDate, initialHour, finalHour, showFavorites, camerasSelected, callback}: RecordsFilterType, ref) => {
    const [showInitialCalendar, setShowInitialCalendar] = useState<boolean>(false)
    const [showFinalCalendar, setShowFinalCalendar] = useState<boolean>(false)
    const [initialDateFilter, setInitialDateFilter] = useState<Date>(initialDate)
    const [finalDateFilter, setFinalDateFilter] = useState<Date>(finalDate)
    const [initialHourFilter, setInitialHourFiltler] = useState<string>(initialHour.replace(/\D/g, ''))
    const [finalHourFilter, setFinalHourFilter] = useState<string>(finalHour.replace(/\D/g, ''))
    const [showFavoritesFilter, setShowFavoritesFilter] = useState<boolean>(showFavorites)
    const [filtersActiveCount, setFiltersActiveCount] = useState<number>(0)
    const [apply, setApply] = useState<boolean>(false)
    const [cameras, setCameras] = useState<CameraType[]>([])
    const [camerasFilter, setCamerasFilter] = useState<number[]>(camerasSelected)
    const [resetPending, setResetPending] = useState<boolean>(false)

    const { getCameras } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)

    const handleCamerasFilter = (cameraId: number, checked: boolean) => {
        setCamerasFilter(prevIds =>
            checked ? [...prevIds, cameraId] : prevIds.filter(id => id !== cameraId)
        )       
    }

    const handleApplyFilters = () => {
        setApply(true)
    }

    const handleDisableFilters = () => {
        setInitialDateFilter(new Date())
        setFinalDateFilter(new Date())
        setInitialHourFiltler("000000")
        setFinalHourFilter("235959")
        setShowFavoritesFilter(false)
        setCamerasFilter([])
        setResetPending(true)
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
        if(resetPending){
            setResetPending(false)
            setApply(true)
        }
    }, [resetPending])

    useEffect(() => {
        let count = 2
        const filters = [showFavoritesFilter, camerasFilter.length]
        for(let i=0;i < filters.length;i++){
            if(filters[i]){
                count += 1
            }
        }
        setFiltersActiveCount(count)
    }, [showFavoritesFilter, camerasFilter])

    useEffect(() => {
        if(apply){
            callback({
                showFavorites: showFavoritesFilter,
                initialDate: initialDateFilter,
                finalDate: finalDateFilter,
                initialHour: handleFormatHour(initialHourFilter),
                finalHour: handleFormatHour(finalHourFilter),
                camerasSelected: camerasFilter,
                filtersActiveCount
            })
            setApply(false)
        }
    }, [showFavoritesFilter, initialDateFilter, finalDateFilter, initialHourFilter, finalHourFilter, camerasFilter, apply, filtersActiveCount, callback])

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

    useImperativeHandle(ref, () => ({
        resetFilters: handleDisableFilters,
        applyFilters: handleApplyFilters
    }))

    return (
        <>
            <div className={styles.option}>
                <span className={styles.optionText}>Date range</span>
                <div className={styles.calendarRange}>
                    <div className={styles.calendarContainer}>
                        <span className={styles.calendarText}>From:</span>
                        <DropdownCalendarComponent
                            show={showInitialCalendar}
                            data={initialDateFilter}
                            disabled={isLoading}
                            callbackShow={(value) => setShowInitialCalendar(current => value ?? !current)} 
                            callback={(value) => setInitialDateFilter(value)}
                        />
                    </div>
                    <div className={styles.calendarContainer}>
                        <span className={styles.calendarText}>To:</span>
                        <DropdownCalendarComponent 
                            show={showFinalCalendar} 
                            data={finalDateFilter}
                            disabled={isLoading}
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
                        disabled={isLoading}
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
        </>
    )
})

export default FilterRecordsComponent