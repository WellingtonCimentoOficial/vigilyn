import React, { useContext, useState } from 'react'
import styles from "./ProfilePage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import { PiUser } from "react-icons/pi";
import ButtonComponent from '../../components/Buttons/ButtonComponent/ButtonComponent';
import { PiNotePencil } from "react-icons/pi";
import { formatDateTime } from '../../utils/utils';
import { UserContext } from '../../contexts/UserContext';
import ModalUserComponent from '../../components/Modals/ModalUserComponent/ModalUserComponent';

type Props = {}

const ProfilePage = (props: Props) => {
    const { currentUser } = useContext(UserContext)
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <PageLayout title='Profile' description='Manage personal information, account settings, and security preferences.'>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    {currentUser &&
                        <div className={styles.header}>
                            <div className={styles.headerContainerIcon}>
                                <PiUser className={styles.icon} />
                            </div>
                            <div className={styles.headerContainerBody}>
                                <span className={styles.headerContainerBodyTitle}>{currentUser.name}</span>
                                <span className={styles.headerContainerBodyText}>{currentUser.roles.map(role => role.name).join(", ")}</span>
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.container}>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>Personal Information</span>
                            <ButtonComponent 
                                className={styles.button} 
                                text='Edit' 
                                icon={<PiNotePencil />} 
                                disabled={!currentUser ? true : false}
                                onClick={() => setShowModal(current => !current)} 
                            />
                        </div>
                        <div className={styles.sectionBody}>
                            <div className={styles.sectionBodyColumn}>
                                <div className={styles.sectionBodyItem}>
                                    <span className={styles.sectionBodyItemTitle}>Name</span>
                                    <span className={styles.sectionBodyItemText}>{currentUser ? currentUser.name : ""}</span>
                                </div>
                                <div className={styles.sectionBodyItem}>
                                    <span className={styles.sectionBodyItemTitle}>Email Address</span>
                                    <span className={styles.sectionBodyItemText}>{currentUser ? currentUser.email : ""}</span>
                                </div>
                            </div>
                            <div className={styles.sectionBodyColumn}>
                                <div className={styles.sectionBodyItem}>
                                    <span className={styles.sectionBodyItemTitle}>Status</span>
                                    <span className={styles.sectionBodyItemText}>{currentUser ? currentUser.is_active ? "Active" : "Inactive" : ""}</span>
                                </div>
                                <div className={styles.sectionBodyItem}>
                                    <span className={styles.sectionBodyItemTitle}>Roles</span>
                                    <span className={styles.sectionBodyItemText}>{currentUser ? currentUser.roles.map(role => role.name).join(", ") : ""}</span>
                                </div>
                            </div>
                            <div className={styles.sectionBodyColumn}>
                                <div className={styles.sectionBodyItem}>
                                    <span className={styles.sectionBodyItemTitle}>Created at</span>
                                    <span className={styles.sectionBodyItemText}>{currentUser ? formatDateTime(currentUser.created_at) : ""}</span>
                                </div>
                                <div className={styles.sectionBodyItem}>
                                    <span className={styles.sectionBodyItemTitle}>Updated at</span>
                                    <span className={styles.sectionBodyItemText}>{currentUser ? formatDateTime(currentUser.updated_at) : ""}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalUserComponent showModal={showModal} setShowModal={setShowModal} />
        </PageLayout>
    )
}

export default ProfilePage