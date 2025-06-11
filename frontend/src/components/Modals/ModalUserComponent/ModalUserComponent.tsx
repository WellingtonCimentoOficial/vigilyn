import React, { useCallback, useContext, useEffect, useState } from 'react'
import ModalBaseComponent from '../ModalBaseComponent/ModalBaseComponent'
import styles from "./ModalUserComponent.module.css"
import { PiUser, PiFloppyDisk } from "react-icons/pi";
import InputComponent from '../../Inputs/InputComponent/InputComponent';
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent';
import { emailRegex, passwordRegex } from '../../../utils/regex';
import { useBackendRequests } from '../../../hooks/useBackRequests';
import { UserContext } from '../../../contexts/UserContext';
import { ToastContext } from '../../../contexts/ToastContext';
import { ErrorType, ErrorValidationType, RoleType, UserExtendedType, UserType } from '../../../types/BackendTypes';
import { HexColorPicker } from 'react-colorful';
import CheckBoxComponent from '../../Checkboxes/CheckBoxComponent/CheckBoxComponent';
import CheckBoxSwitchComponent from '../../Checkboxes/CheckBoxSwitchComponent/CheckBoxSwitchComponent';


type Props = {
    data?: UserType
    showModal: boolean
    isCreating?: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    callback: (user: UserType) => void
}

const ModalUserComponent = ({data, showModal, isCreating, callback, setShowModal}: Props) => {
    const { currentUser } = useContext(UserContext)

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    
    const [nameIsValid, setNameIsValid] = useState<boolean>(false)
    const [emailIsValid, setEmailIsValid] = useState<boolean>(false)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState<boolean>(false)
    const [profileColor, setProfileColor] = useState<string>("#ff5100")
    const [roles, setRoles] = useState<RoleType[]|null>(null)
    const [checkedRoles, setCheckedRoles] = useState<{id: number, checked: boolean}[]>([])
    const [checkedRolesIsValid, setCheckedRolesIsValid] = useState<boolean>(false)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [user, setUser] = useState<UserExtendedType|null>(null)

    const { updateMe, getRoles, getUserRoles, updateUserRoles, updateUser, createUser } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)


    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        if(e.target.value && e.target.value.trim() !== "" && e.target.value.trim().length >= 5){
            setNameIsValid(true)
        }else{
            setNameIsValid(false)
        }
        setWasSubmitted(false)
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        setEmailIsValid(emailRegex.test(e.target.value))
        setWasSubmitted(false)
    }
    
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        if(e.target.value !== ""){
            setPasswordIsValid(passwordRegex.test(e.target.value))
            setConfirmPasswordIsValid(false)
        }else{
            setPasswordIsValid(true)
            setConfirmPasswordIsValid(true)
        }
        setWasSubmitted(false)
    }

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
        setConfirmPasswordIsValid(e.target.value === password)
        setWasSubmitted(false)
    }

    const handleSetFields = useCallback((user: UserType) => {
        setName(user.name)
        setNameIsValid(true)
        setEmail(user.email)
        setPassword("")
        setConfirmPassword("")
        setPasswordIsValid(true)
        setConfirmPasswordIsValid(true)
        setProfileColor(user.profile_color)
        setIsActive(user.is_active)
        setEmailIsValid(true)
        setCheckedRolesIsValid(true)
    }, [])

    const handleResetFields = useCallback(() => {
        setName("")
        setNameIsValid(false)
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setPasswordIsValid(false)
        setConfirmPasswordIsValid(false)
        setProfileColor("#ff5100")
        setIsActive(false)
        setCheckedRolesIsValid(false)
        setWasSubmitted(false)
    }, [])

    const handleCheck = (id: number, checked: boolean) => {
        setCheckedRoles(prev => {
            const updated = prev.map(item =>
                item.id === id ? {...item, checked: checked} : item
            )
            
            if(updated.some(item => item.checked)){
                setCheckedRolesIsValid(true)
            }else{
                setCheckedRolesIsValid(false)
            }

            return updated
        })
        setWasSubmitted(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        if(nameIsValid && passwordIsValid && confirmPasswordIsValid && checkedRolesIsValid && !isLoading){
            try {
                const profileDataToUpdate = {
                    name,
                    profile_color: profileColor,
                    ...(password !== "" && { password }),
                    ...(password !== "" && confirmPassword !== "" && { confirm_password: confirmPassword }),

                }

                const userDataToUpdate = {
                    ...profileDataToUpdate,
                    email,
                    is_active: isActive
                }

                const userToCreate = {
                    name,
                    email,
                    profile_color: profileColor,
                    password,
                    confirm_password: confirmPassword,
                    is_active: isActive
                }

                if(isCreating){
                    const newUser = await createUser(userToCreate)
                    await updateUserRoles(newUser.id, {
                        role_ids: checkedRoles.filter(role => role.checked).map(role => role.id)
                    })
                    callback(newUser)
                }else if(data && user){
                    await updateUserRoles(user.id, {
                        role_ids: checkedRoles.filter(role => role.checked).map(role => role.id)
                    })
                    const updatedUser = await updateUser(user.id, userDataToUpdate)
                    callback(updatedUser)
                }else if(currentUser){
                    const updatedUser = await updateMe(profileDataToUpdate)
                    callback(updatedUser)
                }
                setToastMessage({
                    "title": `User ${isCreating ? "created": "updated"} successfully!`, 
                    "description": `The user was ${isCreating ? "created" : "updated"} successfully`, 
                    success: true
                })
                setShowModal(false)
            } catch (error: any) {
                if(error.response?.status === 400){
                    if(error.response?.data?.error === "validation"){
                        const data: ErrorValidationType = error.response?.data
                        if("name" in data.message){
                            setNameIsValid(false)
                            setToastMessage({
                                "title": "Name invalid", 
                                "description": "The name field is invalid", 
                                success: false
                            })
                        }else if("password" in data.message){
                            setPasswordIsValid(false)
                            setToastMessage({
                                "title": "Password invalid", 
                                "description": "The password field is invalid", 
                                success: false
                            })
                        }else if("confirm_password" in data.message){
                            setConfirmPasswordIsValid(false)
                            setToastMessage({
                                "title": "Confirm password invalid", 
                                "description": "The confirm password field is invalid", 
                                success: false
                            })
                        }
                    }else{
                        const data: ErrorType = error.response?.data
                        if(data.error === "user_was_not_created"){
                            setNameIsValid(false)
                            setToastMessage({
                                "title": "User was not created", 
                                "description": data.message, 
                                success: false
                            })
                        }else if(data.error === "user_already_exists"){
                            setToastMessage({
                                "title": "User already exists", 
                                "description": data.message, 
                                success: false
                            })
                            setEmailIsValid(false)
                        }
                    }
                    setWasSubmitted(true)
                }else{
                    setToastMessage({
                        "title": "Failed to update user", 
                        "description": "We couldn't update the user. Please try again later.", 
                        success: false
                    })
                }
            }
        }else{
            setWasSubmitted(true)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        (async () => {
            try {
                const data = await getRoles()
                setRoles(data)
            } catch (error) {
                setToastMessage({
                    "title": "Failed to fetch roles", 
                    "description": "We couldn't fetch the roles. Please try again later.", 
                    success: false
                })
            }
        })()
    }, [getRoles, setToastMessage])

    useEffect(() => {
        (async () => {
            if(data){
                try {
                    const userRoles = await getUserRoles(data.id)
                    setUser({...data, roles: userRoles})
                    setIsActive(data.is_active)
                } catch (error) {
                    setToastMessage({
                        "title": "Failed to fetch user roles", 
                        "description": "We couldn't fetch the user roles. Please try again later.", 
                        success: false
                    })
                }
            }else if(!isCreating && currentUser){
                setUser(currentUser)
                setIsActive(currentUser.is_active)
            }
        })()
    }, [data, currentUser, isCreating, getUserRoles, setToastMessage])

    useEffect(() => {
        if(showModal && roles){
            setCheckedRoles(roles.map(role => ({id: role.id, checked: (!isCreating && user) ? user.roles.some(userRole => userRole.id === role.id) : false})))
        }
    }, [user, roles, isCreating, showModal])


    useEffect(() => {
        if(showModal && !isCreating && user){
            handleSetFields(user)
        }
        if(!showModal){
            handleResetFields()
        }
    }, [showModal, isCreating, user, handleSetFields, handleResetFields])

    return (
        <ModalBaseComponent 
            title={isCreating ? "Create user" : 'Edit user profile' }
            description={isCreating ? 'Set up a new user to start manage your environment.' : 'Update user information, manage access settings, and maintain accurate account details.'}
            showModal={showModal}
            setShowModal={setShowModal}
            footer={
                <div className={styles.footer}>
                    <ButtonComponent 
                        className={styles.button} 
                        text='Cancel' 
                        onClick={() => setShowModal(false)} 
                        disabled={isLoading}
                    />
                    <ButtonComponent 
                        className={styles.button} 
                        text='Save changes'
                        filled 
                        form='form'
                        disabled={isLoading}
                        isLoading={isLoading}
                        icon={<PiFloppyDisk />}
                    />
                </div>
            }
        >
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.containerHeaderIcon} style={{backgroundColor: profileColor}}>
                        <PiUser className={styles.headerIcon} />
                    </div>
                    <HexColorPicker color={profileColor} onChange={setProfileColor} />
                </div>
                <div className={styles.body}>
                    <form id='form' className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formContainer}>
                            <InputComponent 
                                type='text'
                                name='name'
                                id='name'
                                label='Name'
                                placeholder='Type full name'
                                onChange={handleName}
                                value={name}
                                error={!nameIsValid && wasSubmitted}
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formContainer}>
                            <InputComponent 
                                type='text'
                                name='email'
                                id='email'
                                label='Email'
                                placeholder='email@email.com'
                                onChange={handleEmail}
                                value={email}
                                error={!emailIsValid && wasSubmitted}
                                disabled={isLoading || (!data && !isCreating)}
                            />
                        </div>
                        <div className={styles.formContainer}>
                            <InputComponent 
                                type={showPassword ? "text" : "password"} 
                                name='password'
                                id='password'
                                label='Password'
                                onChange={handlePassword}
                                value={password}
                                error={!passwordIsValid && wasSubmitted}
                                disabled={isLoading}
                                setShowPassword={setShowPassword}
                                showPassword={showPassword}
                            />
                        </div>
                        <div className={styles.formContainer}>
                            <InputComponent 
                                type={showConfirmPassword ? "text" : "password"} 
                                name='confirm_password'
                                id='confirm_password'
                                label='Confirm password'
                                onChange={handleConfirmPassword}
                                value={confirmPassword}
                                error={!confirmPasswordIsValid && wasSubmitted}
                                disabled={isLoading}
                                setShowPassword={setShowConfirmPassword}
                                showPassword={showConfirmPassword}
                            />
                        </div>
                        {(data || isCreating) &&
                            <>
                                <div className={styles.formContainer}>
                                    {roles &&
                                        <div className={styles.itemContainer}>
                                            <div className={styles.itemContainerHeader}>
                                                <span className={styles.label}>Roles</span>
                                            </div>
                                            <div className={`${styles.itemContainerBody} ${!checkedRolesIsValid && wasSubmitted ? styles.error : ""}`}>
                                                {roles.map(role => (
                                                    <CheckBoxComponent 
                                                        key={role.id} 
                                                        label={role.name} 
                                                        checked={checkedRoles.find(checkRole => checkRole.id === role.id)?.checked ?? false} 
                                                        callback={(checked) => handleCheck(role.id, checked)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className={styles.formContainer}>
                                    <div className={styles.itemContainer}>
                                        <div className={styles.itemContainerHeader}>
                                            <span className={styles.label}>Active</span>
                                        </div>
                                        <div className={styles.itemContainerBody}>
                                            <CheckBoxSwitchComponent 
                                                size={3}
                                                checked={isActive}
                                                disabled={isLoading}
                                                callback={(checked) => setIsActive(checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </form>
                </div>
            </div>
        </ModalBaseComponent>
    )
}

export default ModalUserComponent