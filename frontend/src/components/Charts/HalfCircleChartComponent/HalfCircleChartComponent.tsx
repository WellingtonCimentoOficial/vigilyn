import React from 'react'
import { ChartType } from '../../../types/FrontendTypes'
import styles from './HalfCircleChartComponent.module.css'

type Props = {
    data: ChartType[]
}

const HalfCircleChartComponent = ({data}: Props) => {
    const newData = data.sort((a, b) => b.value - a.value)
    const maxValue = Math.max(...data.map(item => item.value))
    const minValue = Math.min(...data.map(item => item.value))
    const calc = data.reduce((soma, item) => soma + item.value, 0) / data.length
    const percentage = calc ? Math.floor(calc) : 0
    return (
        <div className={styles.wrapper}>
            <div className={styles.container1}>
                <div className={styles.container1Draw}>
                    <svg className={styles.draw} viewBox="1 16 188 103" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="stripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                                <rect width="4" height="4" fill="white"/>
                                <rect className={styles.drawPathBase} width="2" height="4" />
                            </pattern>
                        </defs>
                        <path d="M20,100 A80,100 0 0,1 170,100"
                            fill="none"
                            stroke="url(#stripes)"
                            strokeWidth="35"
                            strokeLinecap="round"
                            strokeDasharray="225"
                            strokeDashoffset="0" />
                        {newData.map((item, index) => {
                            const style = item.value === maxValue ? styles.normal : item.value === minValue ? styles.lightest : styles.light
                            const offset = 225 - (225 * (item.value / 100))
                            return (
                                <path className={`${styles.drawPath} ${style}`} key={index} d="M20,100 A80,100 0 0,1 170,100"
                                fill="none"
                                strokeWidth="35"
                                strokeLinecap="round"
                                strokeDasharray="225"
                                strokeDashoffset={offset} />
                            )
                        })}
                    </svg>
                </div>
                <div className={styles.containerInfo}>
                    <span className={styles.percentageText}>{percentage}%</span>
                </div>
            </div>
            <div className={styles.container2}>
                <ul className={styles.container2List}>
                    {newData.sort((a, b) => a.value - b.value).map((item, index) => {
                        const style = item.value === maxValue ? styles.normal : item.value === minValue ? styles.lightest : styles.light
                        return (
                            <li key={index} className={styles.container2ListLi}>
                                <div className={`${styles.container2ListLiCircle} ${style}`}></div>
                                <span className={styles.container2ListLiText}>{item.title}</span>
                            </li>
                        )
                    })}
                    <li className={styles.container2ListLi}>
                        <div className={`${styles.container2ListLiCircle} ${styles.drawPathBase}`}></div>
                        <span className={styles.container2ListLiText}>Pending</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default HalfCircleChartComponent