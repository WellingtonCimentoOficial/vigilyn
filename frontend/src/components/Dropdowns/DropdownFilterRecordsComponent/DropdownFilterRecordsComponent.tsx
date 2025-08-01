import React, { useEffect, useRef, useState } from 'react'
import styles from "./DropdownFilterRecordsComponent.module.css"
import FilterRecordsComponent from '../../Filters/FilterRecordsComponent/FilterRecordsComponent'
import { RecordsFilterCallbackType, RecordsFilterHandleType, RecordsFilterType } from '../../../types/FrontendTypes'
import ButtonFilterComponent from '../../Buttons/ButtonFilterComponent/ButtonFilterComponent'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'

type Props = RecordsFilterType & {
    show: boolean
    callbackShow: (value?: boolean) => void
}

const DropdownFilterRecordsComponent = ({isLoading, show, callback, callbackShow, ...rest}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const filtersRef = useRef<RecordsFilterHandleType>(null)
    const [applyIsLoading, setApplyIsLoading] = useState<boolean>(false)
    const [resetIsLoading, setResetIsLoading] = useState<boolean>(false)
    const [filtersActiveCount, setFiltersActiveCount] = useState<number>(2)


    const handleCallback = ({filtersActiveCount, ...rest}: RecordsFilterCallbackType) => {
        setFiltersActiveCount(filtersActiveCount)
        callback({filtersActiveCount, ...rest})
    }

    const handleDisableFilters = () => {
        filtersRef.current?.resetFilters()
        setResetIsLoading(true)
    }

    const handleApplyFilters = () => {
        filtersRef.current?.applyFilters()
        setApplyIsLoading(true)
    }

    useEffect(() => {
        if(!isLoading && (applyIsLoading || resetIsLoading)){
            setApplyIsLoading(false)
            setResetIsLoading(false)
            callbackShow(false)
        }
    }, [isLoading, applyIsLoading, resetIsLoading, callbackShow])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                callbackShow(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [callbackShow])

    return (
        <div className={styles.wrapper} ref={containerRef}>
            <ButtonFilterComponent
                text='Filters' 
                count={filtersActiveCount}
                onClick={() => callbackShow()}
            />
            <div className={`${styles.container} ${show ? styles.containerShow : ""}`}>
                <FilterRecordsComponent 
                    ref={filtersRef} 
                    isLoading={isLoading} 
                    {...rest} 
                    callback={handleCallback} 
                />
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
                        onClick={handleApplyFilters}
                    />
                    </div>
            </div>
        </div>
    )
}

export default DropdownFilterRecordsComponent