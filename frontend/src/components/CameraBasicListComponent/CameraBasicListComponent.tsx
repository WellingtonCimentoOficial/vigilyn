import React from 'react'
import styles from './CameraBasicListComponent.module.css'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { PiPlus } from "react-icons/pi";
import { NavLink } from 'react-router';
import { CameraType } from '../../types/BackendTypes';

type Props = {
    title: string
    data: CameraType[]
}

const CameraBasicListComponent = ({title, data}: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h5 className={styles.title}>{title}</h5>
                <ButtonComponent className={styles.button} text='New' icon={<PiPlus />} />
            </div>
            <div className={styles.body}>
                <ul className={styles.list}>
                    {data.map(item => {
                        const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 35%)`
                        return (
                            <li key={item.id} className={styles.listLi}>
                                <NavLink className={styles.listLiA} to="">
                                    <div className={styles.listLiAImage} style={{backgroundColor: randomColor}}>{item.name[0].toUpperCase()}</div>
                                    <div className={styles.listLiAContent}>
                                        <span className={styles.listLiAContentTitle}>{item.name}</span>
                                        <span className={styles.listLiAContentDescription}>
                                            Accessed by IP
                                            <span className={styles.bold}>{item.ip_address}</span>
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default CameraBasicListComponent