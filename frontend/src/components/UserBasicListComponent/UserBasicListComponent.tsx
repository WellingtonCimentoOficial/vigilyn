import React, { useContext, useEffect, useState } from 'react'
import styles from './UserBasicListComponent.module.css'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { PiPlus } from "react-icons/pi";
import { NavLink } from 'react-router';
import { UserExtendedType, UserType } from '../../types/BackendTypes';
import { useBackendRequests } from '../../hooks/useBackRequests';
import { ToastContext } from '../../contexts/ToastContext';
import SectionComponent from '../SectionComponent/SectionComponent';

type Props = {
    data: UserType[]
}

const UserBasicListComponent = ({data}: Props) => {
    const [users, setUsers] = useState<UserExtendedType[]>([])

    const { getRoles } = useBackendRequests()

    const { setToastMessage } = useContext(ToastContext)

    useEffect(() => {
        (async () => {
            setUsers([])
            for(let i=0;i < data.length;i++){
                try {
                    const user = data[i]
                    const roles = await getRoles(user.id)
                    setUsers(currentValue => [...currentValue, {...user, roles: roles}])
                } catch (error) {
                    setToastMessage({
                        "title": "Failed to load roles", 
                        "description": "We couldn't fetch the user roles. Please try again later.", 
                        success: false
                    })
                }
            }
        })()
    }, [data, getRoles, setToastMessage])

    return (
        <SectionComponent 
            title='Users'
            content={
                <ButtonComponent className={styles.button} text='Add User' icon={<PiPlus />} />
            }
        >
            <ul className={styles.list}>
                {users.map(user => {
                    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`
                    return (
                        <li key={user.id} className={styles.listLi}>
                            <NavLink className={styles.listLiA} to="">
                                <div className={styles.listLiAImage} style={{backgroundColor: randomColor}}>{user.name[0].toUpperCase()}</div>
                                <div className={styles.listLiAContent}>
                                    <span className={styles.listLiAContentTitle}>{user.name}</span>
                                    <span className={styles.listLiAContentDescription}>
                                        Assigned Roles(s)
                                        <span className={styles.bold}>
                                            {user.roles.map(role => role.name).join(", ")}
                                        </span>
                                    </span>
                                </div>
                                <div className={`${styles.listLiAContent} ${styles.levelContainer}`}>
                                    <span className={`${styles.listLiAContentDescription} ${styles.level} ${user.is_active ? styles.high : styles.low}`}>
                                        {user.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </SectionComponent>
    )
}

export default UserBasicListComponent