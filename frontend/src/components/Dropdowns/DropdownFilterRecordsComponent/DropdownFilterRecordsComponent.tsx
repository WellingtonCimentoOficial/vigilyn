import React, { useEffect, useRef, useState } from 'react'
import styles from "./DropdownFilterRecordsComponent.module.css"
import ButtonFilterComponent from '../../Buttons/ButtonFilterComponent/ButtonFilterComponent'
import DropdownCalendarComponent from '../DropdownCalendarComponent/DropdownCalendarComponent'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'
import CheckBoxSwitchComponent from '../../Checkboxes/CheckBoxSwitchComponent/CheckBoxSwitchComponent'

type CallbackProps = {
    showFavorites: boolean
    initialDate: Date | null
    finalDate: Date | null
}
type Props = {
    show: boolean
    callbackShow: (value?: boolean) => void
    callback: ({showFavorites, initialDate, finalDate}: CallbackProps) => void
}

const DropdownFilterRecordsComponent = ({show, callback, callbackShow}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [rangeIsActive, setRangeIsActive] = useState<boolean>(false)
    const [showInitialCalendar, setShowInitialCalendar] = useState<boolean>(false)
    const [showFinalCalendar, setShowFinalCalendar] = useState<boolean>(false)
    const [initialDate, setInitialDate] = useState<Date>(new Date())
    const [finalDate, setFinalDate] = useState<Date>(new Date())
    const [showFavorites, setShowFavorites] = useState<boolean>(false)
    const [filtersActiveCount, setFiltersActiveCount] = useState<number>(0)
    const [apply, setApply] = useState<boolean>(false)

    const handleDisableFilters = () => {
        setRangeIsActive(false)
        setShowFavorites(false)
        setApply(true)
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
        setFiltersActiveCount(0)
        const filters = [showFavorites, rangeIsActive]
        for(let i=0;i < filters.length;i++){
            if(filters[i]){
                setFiltersActiveCount(current => current + 1)
            }
        }
    }, [rangeIsActive, showFavorites])

    useEffect(() => {
        if(apply){
            callback({
                showFavorites,
                initialDate: rangeIsActive ? initialDate : null,
                finalDate: rangeIsActive ? finalDate : null
            })
            setApply(false)
        }
    }, [showFavorites, rangeIsActive, initialDate, finalDate, apply, callback])

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
                                data={initialDate}
                                callbackShow={(value) => setShowInitialCalendar(current => value ?? !current)} 
                                callback={(value) => {setInitialDate(value);setRangeIsActive(true)}}
                            />
                        </div>
                        <div className={styles.calendarContainer}>
                            <span className={styles.calendarText}>To:</span>
                            <DropdownCalendarComponent 
                                show={showFinalCalendar} 
                                data={finalDate}
                                callbackShow={(value) => setShowFinalCalendar(current => value ?? !current)} 
                                callback={(value) => {setFinalDate(value);setRangeIsActive(true)}}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.option}>
                    <span className={styles.optionText}>Favorites</span>
                    <div className={styles.containerCheck}>
                        <div className={styles.checkText}>Show favorites</div>
                        <CheckBoxSwitchComponent 
                            checked={showFavorites} 
                            callback={() => setShowFavorites(current => !current)}
                            size={3}
                        />
                    </div>
                </div>
                <div className={styles.option}>
                    <div className={styles.bottom}>
                        <ButtonComponent 
                            className={styles.button}
                            text="Reset all"
                            disabled={false}
                            isLoading={false}
                            onClick={() => {handleDisableFilters();callbackShow()}}
                        />
                        <ButtonComponent 
                            className={styles.button}
                            text="Apply now"
                            disabled={false}
                            isLoading={false}
                            filled
                            onClick={() => {setApply(true);callbackShow()}}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DropdownFilterRecordsComponent