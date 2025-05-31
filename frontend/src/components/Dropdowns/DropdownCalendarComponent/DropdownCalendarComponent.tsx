import React, { useEffect, useRef } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import styles from "./DropdownCalendarComponent.module.css"
import calendarStyles from "./Calendar.module.css"
import { PiCalendar } from "react-icons/pi";

type Props = {
    data: Date
    show: boolean
    disabled?: boolean
    callbackShow: (value?: boolean) => void
    callback: (value: Date) => void
}

const DropdownCalendarComponent = ({show, data, disabled, callback, callbackShow}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                callbackShow(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [callbackShow])

    const handleFormat = () => {
        const year = data.getFullYear()
        const month = String(data.getMonth() + 1).padStart(2, '0')
        const day = String(data.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    return (
        <div className={styles.wrapper} ref={containerRef}>
            <div className={`${styles.header} ${disabled ? styles.disabled : ""}`} onClick={() => callbackShow()}>
                <span className={styles.title}>
                    {handleFormat()}
                </span>
                <PiCalendar className={styles.icon} />
            </div>
            <div className={`${styles.body} ${show ? styles.bodyShow : ""}`}>
                <Calendar
                allowPartialRange
                    className={calendarStyles.calendar} 
                    value={data}
                    onChange={(value) => {
                        if(value instanceof Date){
                            callback(value)
                            callbackShow()
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default DropdownCalendarComponent