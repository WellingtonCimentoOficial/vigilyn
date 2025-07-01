import React, { useContext, useEffect, useState } from 'react'
import styles from './UserBasicListComponent.module.css'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'
import { PiPlus } from "react-icons/pi";
import { NavLink } from 'react-router';
import { UserProfileType, UserType } from '../../../types/BackendTypes';
import { useBackendRequests } from '../../../hooks/useBackRequests';
import { ToastContext } from '../../../contexts/ToastContext';
import SectionComponent from '../../Sections/SectionComponent/SectionComponent';

type Props = {
    data: UserType[]
    hidden?: boolean
}

const UserBasicListComponent = ({data, hidden}: Props) => {
    const [users, setUsers] = useState<UserProfileType[]>([])

    const { getUserRoles } = useBackendRequests()

    const { setToastMessage } = useContext(ToastContext)

    useEffect(() => {
        (async () => {
            let usersWithRoles: UserProfileType[] = []
            for(let i=0;i < data.length;i++){
                try {
                    const user = data[i]
                    const roles = await getUserRoles(user.id)
                    usersWithRoles.push({...user, roles: roles, favorite: {id: user.id, records: []}})
                } catch (error) {
                    setToastMessage({
                        "title": "Failed to load roles", 
                        "description": "We couldn't fetch the user roles. Please try again later.", 
                        success: false
                    })
                }
            }
            setUsers(usersWithRoles)
        })()
    }, [data, getUserRoles, setToastMessage])

    return (
        <SectionComponent 
            title='Users'
            content={
                <ButtonComponent 
                    className={styles.button} 
                    text='Add User' 
                    icon={<PiPlus />}
                    path='/dashboard/users/'
                />
            }
            hidden={hidden}
        >
            <ul className={styles.list}>
                {users.map(user => (
                    <li key={user.id} className={styles.listLi}>
                        <NavLink className={styles.listLiA} to="/dashboard/users/">
                            <div className={styles.listLiAImage} style={{backgroundColor: user.profile_color}}>{user.name[0].toUpperCase()}</div>
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
                ))}
            </ul>
        </SectionComponent>
    )
}

export default UserBasicListComponent