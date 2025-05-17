import React, { useContext, useEffect, useState } from 'react'
import ModalBaseComponent from '../ModalBaseComponent/ModalBaseComponent'
import styles from "./ModalUserComponent.module.css"
import { PiUser } from "react-icons/pi";
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { nameRegex, passwordRegex } from '../../utils/regex';
import { useBackendRequests } from '../../hooks/useBackRequests';
import { UserContext } from '../../contexts/UserContext';
import { ToastContext } from '../../contexts/ToastContext';
import { ValidationErrorType } from '../../types/BackendTypes';


type Props = {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalUserComponent = ({showModal, setShowModal}: Props) => {
    const { currentUser, setCurrentUser } = useContext(UserContext)

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    
    const [nameIsValid, setNameIsValid] = useState<boolean>(false)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState<boolean>(false)
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { updateMe } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)


    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        setNameIsValid(nameRegex.test(e.target.value))
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true)
        e.preventDefault()
        if(nameIsValid && passwordIsValid && confirmPasswordIsValid && !isLoading){
            try {
                const dataToUpdate = {
                    name,
                    ...(password !== "" && { password }),
                    ...(password !== "" && confirmPassword !== "" && { confirm_password: confirmPassword }),
                }
                const data = await updateMe(dataToUpdate)
                setCurrentUser(prev => {
                    if(prev){
                        return {...data, roles: prev.roles}
                    }
                    return prev
                })
                setToastMessage({
                    "title": "User updated successfully!", 
                    "description": "The user was updated successfully", 
                    success: true
                })
            } catch (error: any) {
                if(error.response?.status === 400){
                    const data: ValidationErrorType = error.response?.data
                    if("name" in data.message){
                        setNameIsValid(false)
                        setToastMessage({
                            "title": "Name invalid", 
                            "description": "The name field is invalid", 
                            success: false
                        })
                    }
                    if("password" in data.message){
                        setPasswordIsValid(false)
                        setToastMessage({
                            "title": "Password invalid", 
                            "description": "The password field is invalid", 
                            success: false
                        })
                    }
                    if("confirm_password" in data.message){
                        setConfirmPasswordIsValid(false)
                        setToastMessage({
                            "title": "Confirm password invalid", 
                            "description": "The confirm password field is invalid", 
                            success: false
                        })
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
        if(currentUser){
            setName(currentUser.name)
            setNameIsValid(true)
            setEmail(currentUser.email)
            setPasswordIsValid(true)
            setConfirmPasswordIsValid(true)
        }
    }, [currentUser])

    useEffect(() => {
        if(!showModal && currentUser){
            setName(currentUser.name)
            setEmail(currentUser.email)
            setPassword("")
            setConfirmPassword("")
            setNameIsValid(true)
            setPasswordIsValid(true)
            setConfirmPasswordIsValid(true)
        }
    }, [showModal, currentUser])

    return (
        <ModalBaseComponent 
            title='Edit user profile' 
            description='Update user information, manage access settings, and maintain accurate account details.'
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
                    />
                </div>
            }
        >
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.containerHeaderIcon}>
                        <PiUser className={styles.headerIcon} />
                    </div>
                    <div className={styles.containerHeaderBody}>
                        <span className={styles.title}>{currentUser?.name}</span>
                        <span className={styles.description}>{currentUser?.email}</span>
                    </div>
                </div>
                <div className={styles.body}>
                    <form id='form' className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formContainer}>
                            <InputComponent 
                                type='text'
                                name='name'
                                id='name'
                                label='Name'
                                placeholder='Type your full name'
                                onChange={handleName}
                                value={name}
                                error={!nameIsValid && wasSubmitted}
                                disabled={isLoading}
                            />
                            <InputComponent 
                                type='text'
                                name='email'
                                id='email'
                                label='Email'
                                placeholder='email@email.com'
                                value={email}
                                disabled={true}
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
                    </form>
                </div>
            </div>
        </ModalBaseComponent>
    )
}

export default ModalUserComponent