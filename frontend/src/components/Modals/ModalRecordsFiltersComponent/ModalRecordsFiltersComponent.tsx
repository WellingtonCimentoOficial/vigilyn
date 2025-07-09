import React, { useEffect, useRef, useState } from 'react'
import styles from "./ModalRecordsFiltersComponent.module.css"
import ModalBaseComponent from '../ModalBaseComponent/ModalBaseComponent'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'
import { RecordsFilterCallbackType, RecordsFilterHandleType, RecordsFilterType } from '../../../types/FrontendTypes'
import FilterRecordsComponent from '../../Filters/FilterRecordsComponent/FilterRecordsComponent'

type Props = RecordsFilterType & {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalRecordsFiltersComponent = ({isLoading, showModal, callback, setShowModal, ...rest}: Props) => {
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
            setShowModal(false)
        }
    }, [isLoading, applyIsLoading, resetIsLoading, setShowModal])

    return (
        <ModalBaseComponent
            title="Filter recordings "
            description="Choose the filters below to find specific recordings faster."
            showModal={showModal}
            setShowModal={setShowModal}
            footer={
                <div className={styles.footer}>
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
            }
        >
            <FilterRecordsComponent 
                ref={filtersRef} 
                isLoading={isLoading} 
                {...rest} 
                callback={handleCallback} 
            />
        </ModalBaseComponent>
    )
}

export default ModalRecordsFiltersComponent