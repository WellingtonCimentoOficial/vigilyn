import React from 'react'
import styles from './CameraBasicListComponent.module.css'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'
import { PiPlus } from "react-icons/pi";
import { NavLink } from 'react-router';
import { CameraType } from '../../../types/BackendTypes';
import SectionComponent from '../../Sections/SectionComponent/SectionComponent';

type Props = {
    data: CameraType[]
    hidden?: boolean
}

const CameraBasicListComponent = ({data, hidden}: Props) => {
    return (
        <SectionComponent 
            title='Cameras'
            content={
                <ButtonComponent 
                    className={styles.button} 
                    text='New' 
                    icon={<PiPlus />} 
                    path='/dashboard/cameras/'
                />
            }
            hidden={hidden}
        >
            <ul className={styles.list}>
                {data.map(item => (
                    <li key={item.id} className={styles.listLi}>
                        <NavLink className={styles.listLiA} to="/dashboard/cameras/">
                            <div className={styles.listLiAImage} style={{backgroundColor: item.profile_color}}>{item.name[0].toUpperCase()}</div>
                            <div className={styles.listLiAContent}>
                                <span className={styles.listLiAContentTitle}>{item.name}</span>
                                <span className={styles.listLiAContentDescription}>
                                    Accessed by IP
                                    <span className={styles.bold}>{item.ip_address}</span>
                                </span>
                            </div>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </SectionComponent>
    )
}

export default CameraBasicListComponent