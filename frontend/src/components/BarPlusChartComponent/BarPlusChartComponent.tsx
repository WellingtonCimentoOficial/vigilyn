import React from 'react'
import styles from './BarPlusChartComponent.module.css'
import { ChartType } from '../../types/FrontendTypes'


type Props = {
    data: ChartType[]
}

const BarPlusChartComponent = ({data}: Props) => {
    const maxValue = Math.max(...data.map(item => item.value))
    const newData = data.map(item => ({...item, value: (item.value / maxValue) * 100}))
    return (
        <div className={styles.wrapper}>
            <ul className={styles.list}>
                {newData.map((item, index) => {
                    const style = item.value >= 90 ? styles.normal : item.value >= 50 ? styles.light : styles.lightest
                    return (
                        <li key={index} className={styles.listLi}>
                            <div className={`${styles.container1} ${style}`} style={{height: `${item.value}%`}}>
                                <div className={styles.tooltip}>{item.value}%</div>
                            </div>
                            <span className={styles.title}>{item.title}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default BarPlusChartComponent