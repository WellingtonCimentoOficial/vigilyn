import React, { useEffect, useState } from 'react'
import styles from "./PaginatorComponent.module.css"
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import SelectComponent from '../../Selects/SelectComponent/SelectComponent';
import { SelectDataType } from '../../../types/FrontendTypes';


type Props = {
    totalCount: number
    currentPage: number
    callback: (limit: number, currentPage: number) => void
}

const PaginatorComponent = ({totalCount, currentPage, callback}: Props) => {
    const [limit, setLimit] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(totalCount / limit))
    const [range, setRange] = useState<[number, number]>([0, 0])
    const [currentPageLocal, setCurrentPageLocal] = useState<number>(currentPage)

    const paginatorData: SelectDataType[] = [
        {id: 0, title: "10", value: "10"},
        {id: 1, title: "20", value: "20"},
        {id: 2, title: "30", value: "30"},
    ]

    useEffect(() => {
        const inital = currentPageLocal - 5 >= 1 ? currentPageLocal - 5 : 0
        const final = inital + 5
        setRange([inital, final])
    }, [currentPageLocal])

    useEffect(() => callback(limit, currentPageLocal), [limit, currentPageLocal, callback])
    useEffect(() => setCurrentPageLocal(currentPage), [currentPage])
    useEffect(() => setTotalPages(Math.ceil(totalCount / limit)), [limit, totalCount])

    return (
        <div className={styles.wrapper}>
            <span className={styles.text}>Showing {currentPageLocal} to {totalPages} of {totalCount} entries</span>
            <div className={styles.paginator}>
                <div className={styles.paginatorController} onClick={() => setCurrentPageLocal(current => current - 1 >= 1 ? current - 1 : 1)}>
                    <PiCaretLeft className={styles.controllerIcon} />
                </div>
                <ul className={styles.pagesList}>
                    {Array.from({length: totalPages}, (_, i) => i + 1).slice(...range).map(page => (
                        <li 
                            key={page} 
                            className={`${styles.pagesListLi} ${page === currentPageLocal ? styles.current : ""}`}
                            onClick={() => setCurrentPageLocal(page)}
                        >
                            {page}
                        </li>
                    ))}
                </ul>
                <div className={styles.paginatorController} onClick={() => setCurrentPageLocal(current => current + 1 <= totalPages ? current + 1 : totalPages)}>
                    <PiCaretRight className={styles.controllerIcon} />
                </div>
            </div>
            <div className={styles.items}>
                <span className={styles.text}>Items per page:</span>
                <SelectComponent 
                    value={String(limit)} 
                    data={paginatorData} 
                    callback={(data: SelectDataType) => setLimit(Number(data.value))}
                />
            </div>
        </div>
    )
}

export default PaginatorComponent