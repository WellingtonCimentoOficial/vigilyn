import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from "./UsersPage.module.css"
import PageLayout from '../../layouts/PageLayout/PageLayout'
import ButtonComponent from '../../components/Buttons/ButtonComponent/ButtonComponent'
import { PiPlus, PiTrash, PiPencilSimple, PiPlay, PiStop, PiArrowCounterClockwise } from "react-icons/pi";
import CheckBoxComponent from '../../components/Checkboxes/CheckBoxComponent/CheckBoxComponent';
import { CameraType, ErrorType, UserType } from '../../types/BackendTypes';
import { useBackendRequests } from '../../hooks/useBackRequests';
import { ToastContext } from '../../contexts/ToastContext';
import SearchBarComponent from '../../components/Searches/SearchBarComponent/SearchBarComponent';
import ModalConfirmationComponent from '../../components/Modals/ModalConfirmationComponent/ModalConfirmationComponent';
import DropdownBasicComponent from '../../components/Dropdowns/DropdownBasicComponent/DropdownBasicComponent';
import ModalCameraComponent from '../../components/Modals/ModalCameraComponent/ModalCameraComponent';
import PaginatorComponent from '../../components/Paginators/PaginatorComponent/PaginatorComponent';
import DropdownFilterComponent from '../../components/Dropdowns/DropdownFilterComponent/DropdownFilterComponent';
import { CheckBoxFilterType } from '../../types/FrontendTypes';
import TagStatusComponent from '../../components/Tags/TagStatusComponent/TagStatusComponent';
import { SettingsContext } from '../../contexts/SettingsContext';
import { formatDateTime } from '../../utils/utils';
import LoaderThreePointsComponent from '../../components/Loaders/LoaderThreePointsComponent/LoaderThreePointsComponent';

type Props = {}

const UsersPage = (props: Props) => {
    const [users, setUsers] = useState<UserType[]>([])
    const [checkedItems, setCheckedItems] = useState<{id: number, checked: boolean}[]>([])
    const [showOptions, setShowOptions] = useState<{id: number, show: boolean}[]>([])
    const [showActions, setShowActions] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [userIdsToDelete, setUserIdsToDelete] = useState<number[]>([]);
    const [userToUpdate, setUserToUpdate] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false)

    const [limit, setLimit] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalCount, setTotalCount] = useState<number>(0)

    const filterData: CheckBoxFilterType[] = [
        {id: 0, title: "Is Active", value: false},
        {id: 1, title: "Not Active", value: false},
    ]

    const [showFilters, setShowFilters] = useState<boolean>(false)
    const [filters, setFilters] = useState<CheckBoxFilterType[]>(filterData)

    const { 
        deleteUser, 
        getUsers,
    } = useBackendRequests()

    const { setToastMessage } = useContext(ToastContext)
    const { settings } = useContext(SettingsContext)

    const handleCheckAll = (checked: boolean) => {
        setCheckedItems(prev => 
            prev.map(item => ({...item, checked: checked}))
        )
    }

    const handleCheck = (id: number, checked: boolean) => {
        setCheckedItems(prev => 
            prev.map(item =>
                item.id === id ? {...item, checked: checked} : item
            )
        )
    }

    const handleShowOptions = (id: number, value?: boolean) => {
        setShowOptions(prev => 
            prev.map(item =>
                item.id === id ? {...item, show: value !== undefined ? value : !item.show} : item
            )
        )
    }

    const handleDeleteUser = async () => {
        for(let i=0; i < userIdsToDelete.length; i++){
            try {
                await deleteUser(userIdsToDelete[i])
                setUsers(prev => prev.filter(user => user.id !== userIdsToDelete[i]))
                setToastMessage({
                    "title": "User deleted successfully!", 
                    "description": "The user has been removed from your list.", 
                    success: true
                })
                setUserIdsToDelete([])
                setTotalCount(current => current - 1)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to delete user", 
                    "description": "We couldn't delete the user. Please try again later.", 
                    success: false
                })
            }
        }
    }


    const handlePagination = useCallback((limit: number, currentPage: number) => {
        setLimit(limit)
        setCurrentPage(currentPage)
    }, [])

    const handleAddUser = (user: UserType) => {
        if(users.length >= 10){
            setUsers(prev => [user, ...prev.filter(item => item.id !== user.id).slice(0, -1)])
        }else{
            setUsers(prev => [user, ...prev.filter(item => item.id !== user.id)])
        }
        setTotalCount(current => current + 1)
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            try {
                const isActive = filters.find(item => item.id === 0)
                const notActive = filters.find(item => item.id === 1)
                const active = (isActive?.value && notActive?.value) ? undefined : isActive?.value ? "true" : notActive?.value ? "false" : undefined
                const params = {
                    limit, 
                    page: currentPage, 
                    ...(debouncedSearch && { search: debouncedSearch }),
                    ...(debouncedSearch && { role: debouncedSearch }),
                    ...(active !== undefined && { is_active: active }),
                }
                const data = await getUsers(params)
                setTotalCount(data.total_count)
                setUsers(data.data)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to load users", 
                    "description": "We couldn't fetch the user list. Please try again later.", 
                    success: false
                })
            }
            setIsLoading(false)
        })()
    }, [limit, currentPage, debouncedSearch, filters, getUsers, setToastMessage])

    useEffect(() => {
        setCheckedItems([
            {id: 999999999, checked: false}, 
            ...users.map(user => ({id: user.id, checked: false}))
        ])
        setShowOptions(users.map(user => ({id: user.id, show: false})))
    }, [users])

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 800)
        return () => clearTimeout(timeout)
    }, [search])

    return (
        <PageLayout 
            title='Users' 
            description='Streamline user management by creating, editing, deleting, and configuring user settings in one centralized dashboard.'
            content={
            <ButtonComponent 
                className={styles.button}
                text='New user' 
                icon={<PiPlus />} 
                filled 
                onClick={() => {setUserToUpdate(null);setShowModal(true)}} 
            />
        }
        >
            <div className={styles.wrapper}>
                <div className={styles.containerHeader}>
                    <SearchBarComponent 
                        className={styles.searchBar}
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search by name or email'
                        disabled={isLoading}
                    />
                    <div className={styles.containerFilters}>
                        <CheckBoxComponent 
                            className={styles.checkboxFilter} 
                            label={`${checkedItems.filter(item => item.id !== 999999999 && item.checked).length} selected`}
                            checked
                        />
                        {(() => {
                            const data = checkedItems.filter(item => item.checked).map(item => item.id)
                            const disabled = data.length > 0 ? false : true
                            return (
                                <DropdownBasicComponent
                                    data={[
                                        {name: "Delete", icon: <PiTrash />, disabled: disabled, callback: () => {setUserIdsToDelete(data);setShowConfirmation(true)}},
                                    ]}
                                    show={showActions}
                                    callbackShow={(value) => setShowActions(current => value ?? !current)}
                                />
                            )
                        })()}
                        {(() => {
                            return (
                                <DropdownFilterComponent 
                                    data={filters} 
                                    show={showFilters} 
                                    callbackShow={(value) => setShowFilters(current => value ?? !current)}
                                    callback={(id, checked) => setFilters(filter => filter.map(item => item.id === id ? {...item, value: checked} : item))} 
                                />
                            )
                        })()}
                    </div>
                </div>
                <div className={styles.container}>
                    {!isLoading ? (
                        users.length > 0 ? (
                            <>
                                <div className={styles.containerTable}>
                                    <table className={styles.table}>
                                        <thead className={styles.thead}>
                                            <tr className={styles.tr}>
                                                <th className={styles.th}>
                                                    <CheckBoxComponent 
                                                        checked={checkedItems.find(item => item.id === 999999999)?.checked ?? false} 
                                                        callback={(checked) => handleCheckAll(checked)} 
                                                    />
                                                </th>
                                                <th className={styles.th}>Name</th>
                                                <th className={styles.th}>Email</th>
                                                <th className={styles.th}>Created at</th>
                                                <th className={styles.th}>Updated at</th>
                                                <th className={`${styles.th} ${styles.textCenter}`}>Is Active</th>
                                                <th className={`${styles.th} ${styles.textCenter}`}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className={styles.tbody}>
                                            {users.map(user => (
                                                <tr key={user.id} className={styles.tr}>
                                                    <th className={styles.th}>
                                                        <CheckBoxComponent 
                                                            checked={checkedItems.find(item => item.id === user.id)?.checked ?? false} 
                                                            callback={(checked) => handleCheck(user.id, checked)} 
                                                        />
                                                    </th>
                                                    <td className={`${styles.td} ${styles.profile}`}>
                                                        <div className={styles.profileContainerIcon} style={{backgroundColor: user.profile_color}}>{user.name[0]}</div>
                                                        {user.name}
                                                    </td>
                                                    <td className={styles.td}>{user.email}</td>
                                                    <td className={styles.td}>{formatDateTime(user.created_at)}</td>
                                                    <td className={styles.td}>{formatDateTime(user.updated_at)}</td>
                                                    <td className={`${styles.td} ${styles.textCenter}`}>
                                                        <TagStatusComponent 
                                                            text={user.is_active ? "Active" : "Not Active"} 
                                                            success={user.is_active ? true : false} 
                                                        />
                                                    </td>
                                                    <td className={`${styles.td}`}>
                                                        <DropdownBasicComponent
                                                            data={[
                                                                {name: "Edit", icon: <PiPencilSimple />, callback: () => {setUserToUpdate(user);setShowModal(true)}},
                                                                {name: "Delete", icon: <PiTrash />, callback: () => {setUserIdsToDelete([user.id]);setShowConfirmation(true)}},
                                                            ]}
                                                            show={showOptions.find(item => item.id === user.id)?.show ?? false}
                                                            callbackShow={(value) => handleShowOptions(user.id, value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <PaginatorComponent 
                                    currentPage={currentPage} 
                                    totalCount={totalCount} 
                                    callback={handlePagination} 
                                />
                            </>
                        ):(
                            <span style={{textAlign: "center", color: "var(--black-color-light)"}}>nothing to see around here...</span>
                        )
                    ):(
                        <LoaderThreePointsComponent />
                    )}
                </div>
            </div>
            <ModalConfirmationComponent 
                showModal={showConfirmation} 
                setShowModal={setShowConfirmation}
                callback={handleDeleteUser}
            />
            {/* <ModalCameraComponent 
                setShowModal={setShowModal}
                showModal={showModal} 
                data={userToUpdate || undefined}
                callback={handleAddUser}
            /> */}
        </PageLayout>
    )
}

export default UsersPage