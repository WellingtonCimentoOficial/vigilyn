import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from "./RecordsPage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import CardThumbnailComponent from '../../components/Cards/CardThumbnailComponent/CardThumbnailComponent'
import { useBackendRequests } from '../../hooks/useBackRequests'
import { ErrorType, RecordType } from '../../types/BackendTypes'
import { ToastContext } from '../../contexts/ToastContext'
import SearchBarComponent from '../../components/Searches/SearchBarComponent/SearchBarComponent'
import CheckBoxComponent from '../../components/Checkboxes/CheckBoxComponent/CheckBoxComponent'
import DropdownBasicComponent from '../../components/Dropdowns/DropdownBasicComponent/DropdownBasicComponent'
import { PiTrash, PiArrowDown } from "react-icons/pi";
import ModalConfirmationComponent from '../../components/Modals/ModalConfirmationComponent/ModalConfirmationComponent'
import ModalVideoComponent from '../../components/Modals/ModalVideoComponent/ModalVideoComponent'
import LoaderThreePointsComponent from '../../components/Loaders/LoaderThreePointsComponent/LoaderThreePointsComponent'
import { UserContext } from '../../contexts/UserContext'
import DropdownFilterRecordsComponent from '../../components/Dropdowns/DropdownFilterRecordsComponent/DropdownFilterRecordsComponent'
import ModalRecordsFiltersComponent from '../../components/Modals/ModalRecordsFiltersComponent/ModalRecordsFiltersComponent'
import ButtonFilterComponent from '../../components/Buttons/ButtonFilterComponent/ButtonFilterComponent'


type Props = {}

const RecordsPage = (props: Props) => {
    const limit = 16
    const [totalPages, setTotalPages] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [records, setRecords] = useState<RecordType[]>([])
    const [search, setSearch] = useState<string>("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [checkedItems, setCheckedItems] = useState<{id: number, checked: boolean}[]>([])
    const [showActions, setShowActions] = useState<boolean>(false)
    const [showFilters, setShowFilters] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [showFavoritesFilter, setShowFavoritesFilter] = useState<boolean>(false)
    const [initialDateFilter, setInitialDateFilter] = useState<Date>(new Date())
    const [finalDateFilter, setFinalDateFilter] = useState<Date>(new Date())
    const [initialHourFilter, setInitialHourFilter] = useState<string>("00:00:00")
    const [finalHourFilter, setFinalHourFilter] = useState<string>("23:59:59")
    const [camerasFilter, setCamerasFilter] = useState<number[]>([])
    const [record, setRecord] = useState<RecordType|null>(null)
    const [showVideoModal, setShowVideoModal] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [filtersActiveCount, setFiltersActiveCount] = useState<number>(2)

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const hasLoadedOnce = useRef(false)

    const { getRecords, deleteRecords, downloadMultipleRecords } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)
    const { userPermissions } = useContext(UserContext)

    const handleResize = () => {
        if(window.innerWidth <= 465){
            setIsMobile(true)
        }else{
            setIsMobile(false)
        }
    }

    const handleDownloadRecords = async () => {
        setIsLoading(true)
        try {
            setToastMessage({
                title: "Download requested", 
                description: "Download has been requested. Please wait for it to begin.", 
                success: true
            })

            const recordIdsToDownload = checkedItems.filter(item => item.checked).map(item => item.id) 
            const url = await downloadMultipleRecords(recordIdsToDownload)
            const link = document.createElement("a")
            
            link.href = url
            link.setAttribute("download", "records.zip")
            
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            setToastMessage({
                title: "Download started", 
                description: "The download has started. If it doesn't begin automatically, please try again or check your connection.", 
                success: true
            })
        } catch (error: any) {
            if(error.response?.status === 403 && error.response?.data.error === "permission_denied"){
                setToastMessage({
                    title: "Failed to download selected records",
                    description: "You do not have permission to download recordings.",
                    success: false
                })
            }else{
                setToastMessage({
                    title: "Failed to download selected records",
                    description: "An error occurred while trying to dowbload the selected items. Please try again.",
                    success: false
                })
            }
        }
        setIsLoading(false)
    }

    const handleDeleteRecords = async () => {
        setIsLoading(true)
        try {
            const recordIdsToDelete = checkedItems.filter(item => item.checked).map(item => item.id)
            await deleteRecords(recordIdsToDelete)
            setToastMessage({
                title: "Selected records deleted successfully!",
                description: "The selected items have been removed from your list.",
                success: true
            })
            setRecords(prev => prev.filter(item => !recordIdsToDelete.includes(item.id)))
        } catch (error: any) {
            if(error.response?.status === 403 && error.response?.data.error === "permission_denied"){
                setToastMessage({
                    title: "Failed to delete selected records",
                    description: "You do not have permission to delete recordings.",
                    success: false
                })
            }else{
                setToastMessage({
                    title: "Failed to delete selected records",
                    description: "An error occurred while trying to remove the selected items. Please try again.",
                    success: false
                })
            }
        }
        setIsLoading(false)
    }
    
    const handleCheck = (id: number, checked: boolean) => {
        setCheckedItems(prev => 
            prev.map(item =>
                item.id === id ? {...item, checked: checked} : item
            )
        )
    }

    const handleCheckAll = (checked: boolean) => {
        checkedItems.forEach(item => {
            handleCheck(item.id, checked)
        })
    }

    const handleRemove = (recordId: number) => {
        setRecords(prev => prev.filter(item => item.id !== recordId))
    }

    const handleFormatDateFilter = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    useEffect(() => {
        (async () => {
            try {
                const data = await getRecords({
                    limit: 16, 
                    page,
                    search: debouncedSearch,
                    show_favorites: showFavoritesFilter,
                    initial_date: handleFormatDateFilter(initialDateFilter),
                    final_date: handleFormatDateFilter(finalDateFilter),
                    initial_hour: initialHourFilter,
                    final_hour: finalHourFilter,
                    cameraIds: camerasFilter
                })

                if(page === 1){
                    setRecords(data.data)    
                }else{
                    setRecords(current => [...current, ...data.data])
                }

                setTotalPages(Math.ceil(data.total_count / limit))
            } catch (error: any) {
                if(error.response?.status === 400){
                    const data: ErrorType = error.response.data
                    if ("invalid_initial_date_param" === data.error) {
                        setToastMessage({
                            title: "Invalid Start Date",
                            description: "The start date provided is not valid. Please check the format and try again.",
                            success: false
                        })
                    } else if ("invalid_final_date_param" === data.error) {
                        setToastMessage({
                            title: "Invalid End Date",
                            description: "The end date provided is not valid. Please check the format and try again.",
                            success: false
                        })
                    } else if ("missing_date_param" === data.error) {
                        setToastMessage({
                            title: "Missing Date",
                            description: "A required date parameter is missing. Please select both start and end dates.",
                            success: false
                        })
                    } else if ("invalid_date_range_param" === data.error) {
                        setToastMessage({
                            title: "Invalid Date Range",
                            description: "The start date must be earlier than the end date. Please adjust the range and try again.",
                            success: false
                        })
                    }else if ("invalid_initial_hour_param" === data.error) {
                        setToastMessage({
                            title: "Invalid Start Hour",
                            description: "The start hour provided is not valid. Please check the format and try again.",
                            success: false
                        })
                    } else if ("invalid_final_hour_param" === data.error) {
                        setToastMessage({
                            title: "Invalid End Hour",
                            description: "The end hour provided is not valid. Please check the format and try again.",
                            success: false
                        })
                    } else if ("missing_hour_param" === data.error) {
                        setToastMessage({
                            title: "Missing Hour",
                            description: "A required hour parameter is missing. Please select both start and end hours.",
                            success: false
                        })
                    } else if ("invalid_hour_range_param" === data.error) {
                        setToastMessage({
                            title: "Invalid Hour Range",
                            description: "The start hour must be earlier than the end hour. Please adjust the range and try again.",
                            success: false
                        })
                    }
                }else{
                    setToastMessage({
                        "title": "Failed to load records", 
                        "description": "We couldn't fetch the records data. Please try again later.", 
                        success: false
                    })
                }
            }
            setIsLoading(false)
        })()
    }, [page, showFavoritesFilter, initialDateFilter, finalDateFilter, debouncedSearch, initialHourFilter, finalHourFilter, camerasFilter, getRecords, setToastMessage])

    const observer = useMemo(() => {
        const obs = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting){
                if(!hasLoadedOnce.current){
                    hasLoadedOnce.current = true
                    return
                }
                setPage(current => {
                    const newValue = current + 1
                    if(newValue <= totalPages){
                        return newValue
                    }
                    return current
                })
            }
        })
        return obs
    }, [totalPages])

    useEffect(() => {
        const target = bottomRef.current

        if(target){
            observer.observe(target)
        }

        return () => {
            if(target){
                observer.unobserve(target)
            }
        }
    }, [observer])

    useEffect(() => {
        setCheckedItems(prev => {
            const prevMap = new Map(prev.map(item => [item.id, item.checked]))

            const merged = [
                { id: 999999999, checked: prevMap.get(999999999) ?? false },
                ...records.map(record => ({
                    id: record.id,
                    checked: prevMap.get(record.id) ?? false
                }))
            ];

            return merged
        })
    }, [records])

    useEffect(() => {
        const timeout = setTimeout(() =>{ setDebouncedSearch(search);setPage(1)}, 800)
        return () => clearTimeout(timeout)
    }, [search])

    useEffect(() => setRecord(current => showVideoModal ? current : null), [showVideoModal])

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <PageLayout
            title='Records'
            description='Access, manage and review recorded video footage from surveillance cameras with playback and organizational tools.'
        >
            <div className={styles.wrapper}>
                <div className={styles.containerHeader}>
                    <SearchBarComponent
                        className={styles.searchBar}
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search by record name'
                        disabled={isLoading}
                    />
                    <div className={styles.containerFilters}>
                        <CheckBoxComponent 
                            className={records.length === 0 ? styles.checkboxFilter : ""} 
                            label={`${checkedItems.filter(item => item.id !== 999999999 && item.checked).length} selected`}
                            checked={checkedItems.filter(item => item.checked).length === checkedItems.length}
                            callback={(checked) => handleCheckAll(checked)}
                        />
                        {(() => {
                            const data = checkedItems.filter(item => item.checked).map(item => item.id)
                            const disabled = data.length > 0 ? false : true

                            const dataDropdown = [
                                {name: "Delete", icon: <PiTrash />, disabled: !userPermissions.has("delete_record"), callback: () => setShowConfirmation(true)},
                                {name: "Download", icon: <PiArrowDown />, disabled: !userPermissions.has("download_record"), callback: handleDownloadRecords}
                            ]
                            return (
                                <DropdownBasicComponent
                                    data={dataDropdown}
                                    disabled={disabled || isLoading}
                                    show={showActions}
                                    callbackShow={(value) => setShowActions(current => value ?? !current)}
                                />
                            )
                        })()}
                        {isMobile ? (
                            <ButtonFilterComponent
                                text='Filters' 
                                count={filtersActiveCount}
                                onClick={() => setShowFilters(current => !current)}
                            />
                        ):(
                            <DropdownFilterRecordsComponent
                                show={showFilters}
                                isLoading={isLoading}
                                initialDate={initialDateFilter}
                                finalDate={finalDateFilter}
                                initialHour={initialHourFilter}
                                finalHour={finalHourFilter}
                                showFavorites={showFavoritesFilter}
                                camerasSelected={camerasFilter}
                                callback={(props) => {
                                    setShowFavoritesFilter(props.showFavorites)
                                    setInitialDateFilter(props.initialDate)
                                    setFinalDateFilter(props.finalDate)
                                    setInitialHourFilter(props.initialHour)
                                    setFinalHourFilter(props.finalHour)
                                    setCamerasFilter(props.camerasSelected)
                                    setPage(1)
                                    setIsLoading(true)
                                }}
                                callbackShow={(value) => setShowFilters(current => value ?? !current)}
                            />
                        )}
                    </div>
                </div>
                <div className={styles.section1}>
                    {!isLoading ? (
                        records.length > 0 ? (
                            <>
                                {records.map(record => (
                                    <div key={record.id} className={styles.containerThumb}>
                                        <CardThumbnailComponent 
                                            record={record} 
                                            callback={handleRemove} 
                                            onClick={() => {setRecord(record);setShowVideoModal(true)}}
                                        />
                                        <div className={styles.containerCheckbox}>
                                            <CheckBoxComponent 
                                                checked={checkedItems.find(item => item.id === record.id)?.checked ?? false}
                                                callback={(checked) => handleCheck(record.id, checked)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ):(
                            <span style={{textAlign: "center", color: "var(--black-color-light)", width: "100%"}}>Oops! We couldn’t find anything that matches your filters and date range.</span>
                        )
                    ):(
                        <LoaderThreePointsComponent />
                    )}
                </div>
                <ModalConfirmationComponent
                    showModal={showConfirmation} 
                    setShowModal={setShowConfirmation}
                    callback={handleDeleteRecords}
                />
                {record &&
                    <ModalVideoComponent
                        data={record}
                        showModal={showVideoModal}
                        setShowModal={setShowVideoModal}
                    />
                }
                {isMobile &&
                    <ModalRecordsFiltersComponent 
                        showModal={showFilters}
                        isLoading={isLoading}
                        initialDate={initialDateFilter}
                        finalDate={finalDateFilter}
                        initialHour={initialHourFilter}
                        finalHour={finalHourFilter}
                        showFavorites={showFavoritesFilter}
                        camerasSelected={camerasFilter}
                        callback={(props) => {
                            setShowFavoritesFilter(props.showFavorites)
                            setInitialDateFilter(props.initialDate)
                            setFinalDateFilter(props.finalDate)
                            setInitialHourFilter(props.initialHour)
                            setFinalHourFilter(props.finalHour)
                            setCamerasFilter(props.camerasSelected)
                            setFiltersActiveCount(props.filtersActiveCount)
                            setPage(1)
                            setIsLoading(true)
                        }}
                        setShowModal={setShowFilters}
                    />
                }
                <div ref={bottomRef} style={{height: 1}}></div>
            </div>
        </PageLayout>
    )
}

export default RecordsPage