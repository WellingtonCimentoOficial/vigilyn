import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from "./RecordsPage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import CardThumbnailComponent from '../../components/Cards/CardThumbnailComponent/CardThumbnailComponent'
import { useBackendRequests } from '../../hooks/useBackRequests'
import { RecordType } from '../../types/BackendTypes'
import { ToastContext } from '../../contexts/ToastContext'
import SearchBarComponent from '../../components/Searches/SearchBarComponent/SearchBarComponent'
import DropdownCalendarComponent from '../../components/Dropdowns/DropdownCalendarComponent/DropdownCalendarComponent'
import CheckBoxComponent from '../../components/Checkboxes/CheckBoxComponent/CheckBoxComponent'
import DropdownBasicComponent from '../../components/Dropdowns/DropdownBasicComponent/DropdownBasicComponent'
import { PiTrash } from "react-icons/pi";
import DropdownFilterRecordsComponent from '../../components/Dropdowns/DropdownFilterRecordsComponent/DropdownFilterRecordsComponent'
import ModalConfirmationComponent from '../../components/Modals/ModalConfirmationComponent/ModalConfirmationComponent'


type Props = {}

const RecordsPage = (props: Props) => {
    const limit = 16
    const [totalPages, setTotalPages] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [records, setRecords] = useState<RecordType[]>([])
    const [search, setSearch] = useState<string>("")
    const [checkedItems, setCheckedItems] = useState<{id: number, checked: boolean}[]>([])
    const [showActions, setShowActions] = useState<boolean>(false)
    const [showFilters, setShowFilters] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [showFavoritesFilter, setShowFavoritesFilter] = useState<boolean>(false)
    const [initialDateFilter, setInitialDateFilter] = useState<Date|null>(null)
    const [finalDateFilter, setFinalDateFilter] = useState<Date|null>(null)

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const hasLoadedOnce = useRef(false)

    const { getRecords, deleteRecords } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)

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
        } catch (error) {
            setToastMessage({
                title: "Failed to delete selected records",
                description: "An error occurred while trying to remove the selected items. Please try again.",
                success: false
            })
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
                    search,
                    show_favorites: showFavoritesFilter,
                    ...(initialDateFilter && {initial_date: handleFormatDateFilter(initialDateFilter)}),
                    ...(finalDateFilter && {final_date: handleFormatDateFilter(finalDateFilter)})
                })

                if(page === 1){
                    setRecords(data.data)    
                }else{
                    setRecords(current => [...current, ...data.data])
                }

                setTotalPages(Math.ceil(data.total_count / limit))
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load records", 
                    "description": "We couldn't fetch the records data. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [page, showFavoritesFilter, initialDateFilter, finalDateFilter, search, getRecords, setToastMessage])

    useEffect(() => {
        setPage(1)
    }, [showFavoritesFilter, initialDateFilter, finalDateFilter, search])

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
                        disabled={false}
                    />
                    <div className={styles.containerFilters}>
                        <CheckBoxComponent 
                            className={styles.checkboxFilter} 
                            label={`${checkedItems.filter(item => item.id !== 999999999 && item.checked).length} selected`}
                            checked
                        />
                        {(() => {
                            const data = checkedItems.filter(item => item.checked).map(item => item.id)
                            const disabled = data.length > 0 ? false : true
                            return (
                                <DropdownBasicComponent
                                    data={[
                                        {name: "Delete", icon: <PiTrash />, disabled: disabled, callback: () => setShowConfirmation(true)},
                                    ]}
                                    show={showActions}
                                    callbackShow={(value) => setShowActions(current => value ?? !current)}
                                />
                            )
                        })()}
                        <DropdownFilterRecordsComponent 
                            show={showFilters}
                            callback={(props) => {setShowFavoritesFilter(props.showFavorites);setInitialDateFilter(props.initialDate);setFinalDateFilter(props.finalDate)}}
                            callbackShow={(value) => setShowFilters(current => value ?? !current)}
                        />
                    </div>
                </div>
                <div className={styles.section1}>
                    {records.map(record => (
                        <div key={record.id} className={styles.containerThumb}>
                            <CardThumbnailComponent record={record} callback={handleRemove} />
                            <div className={styles.containerCheckbox}>
                                <CheckBoxComponent 
                                    checked={checkedItems.find(item => item.id === record.id)?.checked ?? false}
                                    callback={(checked) => handleCheck(record.id, checked)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <ModalConfirmationComponent
                    showModal={showConfirmation} 
                    setShowModal={setShowConfirmation}
                    callback={handleDeleteRecords}
                />
                <div ref={bottomRef} style={{height: 1}}></div>
            </div>
        </PageLayout>
    )
}

export default RecordsPage