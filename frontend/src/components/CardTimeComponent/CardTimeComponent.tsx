import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './CardTimeComponent.module.css'

type Props = {
    timeIso: string
}

const CardTimeComponent = ({timeIso}: Props) => {
    const [time, setTime] = useState("")
    const [day, setDay] = useState("")

    const dateRef = useRef(new Date(timeIso))

    const weekdays = useMemo(() => [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ], [])

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date(dateRef.current.getTime() + 1000) // soma 1s
            dateRef.current = date

            const hours = String(date.getUTCHours()).padStart(2, "0")
            const minutes = String(date.getUTCMinutes()).padStart(2, "0")
            const seconds = String(date.getUTCSeconds()).padStart(2, "0")

            setTime(`${hours}:${minutes}:${seconds}`)
            setDay(weekdays[date.getUTCDay()])
        }, 1000)

        return () => clearInterval(interval)
    }, [weekdays])

    return (
        <div className={styles.wrapper}>
            <span className={styles.headerText}>System Time</span>
            <span className={styles.bodyText}>{time}</span>
            <span className={styles.footerText}>It's {day}</span>
        </div>
    )
}

export default CardTimeComponent