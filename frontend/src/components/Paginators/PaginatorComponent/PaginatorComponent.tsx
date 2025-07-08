import React, { useEffect, useState } from 'react'
import styles from "./PaginatorComponent.module.css"
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import SelectComponent from '../../Selects/SelectComponent/SelectComponent';
import { SelectDataType } from '../../../types/FrontendTypes';


type Props = {
    totalCount: number
    currentPage: number
    limit: number
    callback: (limit: number, currentPage: number) => void
}

const PaginatorComponent = ({totalCount, currentPage, limit, callback}: Props) => {
    const [localLimit, setLocalLimit] = useState<number>(limit)
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(totalCount / localLimit))
    const [range, setRange] = useState<[number, number]>([0, 0])
    const [localCurrentPage, setLocalCurrentPage] = useState<number>(currentPage)

    const paginatorData: SelectDataType[] = [
        {id: 0, title: "10", value: "10"},
        {id: 1, title: "20", value: "20"},
        {id: 2, title: "30", value: "30"},
    ]

    useEffect(() => {
        const inital = localCurrentPage - 5 >= 1 ? localCurrentPage - 5 : 0
        const final = inital + 5
        setRange([inital, final])
    }, [localCurrentPage])

    useEffect(() => callback(localLimit, localCurrentPage), [localLimit, localCurrentPage, callback])
    useEffect(() => setLocalCurrentPage(currentPage), [currentPage])
    useEffect(() => setLocalLimit(limit), [limit])
    useEffect(() => setTotalPages(Math.ceil(totalCount / localLimit)), [localLimit, totalCount])

    return (
        <div className={styles.wrapper}>
            <span className={styles.text}>Showing {localCurrentPage} to {totalPages} of {totalCount} entries</span>
            <div className={styles.paginator}>
                <div className={styles.paginatorController} onClick={() => setLocalCurrentPage(current => current - 1 >= 1 ? current - 1 : 1)}>
                    <PiCaretLeft className={styles.controllerIcon} />
                </div>
                <ul className={styles.pagesList}>
                    {Array.from({length: totalPages}, (_, i) => i + 1).slice(...range).map(page => (
                        <li 
                            key={page} 
                            className={`${styles.pagesListLi} ${page === localCurrentPage ? styles.current : ""}`}
                            onClick={() => setLocalCurrentPage(page)}
                        >
                            {page}
                        </li>
                    ))}
                </ul>
                <div className={styles.paginatorController} onClick={() => setLocalCurrentPage(current => current + 1 <= totalPages ? current + 1 : totalPages)}>
                    <PiCaretRight className={styles.controllerIcon} />
                </div>
            </div>
            <div className={styles.items}>
                <span className={styles.text}>Items per page:</span>
                <SelectComponent 
                    value={String(localLimit)} 
                    data={paginatorData} 
                    callback={(data: SelectDataType) => setLocalLimit(Number(data.value))}
                />
            </div>
        </div>
    )
}

export default PaginatorComponent