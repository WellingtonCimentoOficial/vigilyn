import React from 'react'
import styles from './UserBasicListComponent.module.css'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { PiPlus } from "react-icons/pi";
import { NavLink } from 'react-router';
import { UserType } from '../../types/BackendTypes';

type Props = {
    title: string
    data: UserType[]
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
                                <NavLink className={styles.listLiA} to="">
                                    <div className={styles.listLiAImage} style={{backgroundColor: randomColor}}>{item.name[0].toUpperCase()}</div>
                                    <div className={styles.listLiAContent}>
                                        <span className={styles.listLiAContentTitle}>{item.name}</span>
                                        <span className={styles.listLiAContentDescription}>
                                            Assigned Roles(s)
                                            <span className={styles.bold}>EDITAR</span>
                                        </span>
                                    </div>
                                    {/* {
                                        (() => {
                                            const style = item.is_active ? styles.high : styles.low
                                            return (
                                                <div className={`${styles.listLiAContent} ${styles.levelContainer}`}>
                                                    <span className={`${styles.listLiAContentDescription} ${styles.level} ${style}`}>
                                                        {item.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                            )
                                        })()
                                    } */}
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