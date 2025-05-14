import React from 'react'
import styles from './UserBasicListComponent.module.css'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { PiPlus } from "react-icons/pi";
import { NavLink } from 'react-router';
import { UserBasicListType } from '../../types/FrontendTypes';

type Props = {
    title: string
    data: UserBasicListType[]
}

const UserBasicListComponent = ({title, data}: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h5 className={styles.title}>{title}</h5>
                <ButtonComponent className={styles.button} text='New' icon={<PiPlus />} />
            </div>
            <div className={styles.body}>
                <ul className={styles.list}>
                    {data.map(item => {
                        const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`
                        return (
                            <li key={item.id} className={styles.listLi}>
                                <NavLink className={styles.listLiA} to={item.url}>
                                    <div className={styles.listLiAImage} style={{backgroundColor: randomColor}}>{item.title[0].toUpperCase()}</div>
                                    <div className={styles.listLiAContent}>
                                        <span className={styles.listLiAContentTitle}>{item.title}</span>
                                        <span className={styles.listLiAContentDescription}>
                                            Assigned Roles(s)
                                            <span className={styles.bold}>{item.description}</span>
                                        </span>
                                    </div>
                                    {item.status &&
                                        (() => {
                                            const style = item.status.level === "low" ? styles.low : item.status.level === "high" ? styles.high : styles.medium
                                            return (
                                                <div className={`${styles.listLiAContent} ${styles.levelContainer}`}>
                                                    <span className={`${styles.listLiAContentDescription} ${styles.level} ${style}`}>{item.status.label}</span>
                                                </div>
                                            )
                                        })()
                                    }
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default UserBasicListComponent