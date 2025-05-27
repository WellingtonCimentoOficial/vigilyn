import React, { useContext, useEffect, useState } from 'react'
import styles from "./ModalCameraComponent.module.css"
import ModalBaseComponent from '../ModalBaseComponent/ModalBaseComponent'
import { CameraType, ErrorType, ErrorValidationType } from '../../../types/BackendTypes'
import InputComponent from '../../Inputs/InputComponent/InputComponent'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'
import { ToastContext } from '../../../contexts/ToastContext'
import { useBackendRequests } from '../../../hooks/useBackRequests'
import { ipRegex, pathRegex } from '../../../utils/regex'
import { PiFloppyDisk, PiCaretDown } from "react-icons/pi";
import { HexColorPicker } from 'react-colorful'
import { motion, AnimatePresence } from "framer-motion"

type Props = {
    showModal: boolean
    data?: CameraType
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    callback: (camera: CameraType) => void
}

const ModalCameraComponent = ({showModal, data, setShowModal, callback}: Props) => {
    const [name, setName] = useState<string>("")
    const [nameIsValid, setNameIsValid] = useState<boolean>(false)

    const [ipAddress, setIpAddress] = useState<string>("")
    const [ipAddressIsValid, setIpAddressIsValid] = useState<boolean>(false)

    const [port, setPort] = useState<number>(0)
    const [portIsValid, setPortIsValid] = useState<boolean>(false)

    const [username, setUsername] = useState<string>("")
    const [usernameIsValid, setUsernameIsValid] = useState<boolean>(false)

    const [password, setPassword] = useState<string>("")
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const [path, setPath] = useState<string>("")
    const [pathIsValid, setPathIsValid] = useState<boolean>(false)

    const [profileColor, setProfileColor] = useState<string>("#ff5100")
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)

    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { setToastMessage } = useContext(ToastContext)
    
    const { updateCamera, createCamera } = useBackendRequests()

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        setNameIsValid(e.target.value.length >= 4 && e.target.value.length <= 15)
        setWasSubmitted(false)
    }

    const handleIpAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIpAddress(e.target.value)
        setIpAddressIsValid(ipRegex.test(e.target.value))
        setWasSubmitted(false)
    }

    const handlePort = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        setPort(value)
        setPortIsValid(Number.isInteger(value) && value >= 1 && value <= 65535)
        setWasSubmitted(false)
    }

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
        setWasSubmitted(false)
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setWasSubmitted(false)
    }

    const handlePath = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPath(e.target.value)
        if(e.target.value !== ""){
            setPasswordIsValid(pathRegex.test(e.target.value))
        }else{
            setPasswordIsValid(true)
        }
        setWasSubmitted(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        if(nameIsValid && ipAddressIsValid && portIsValid && usernameIsValid && passwordIsValid && pathIsValid && !isLoading){
            try {
                const dataToCreateUpdate = {
                    name,
                    profile_color: profileColor,
                    ip_address: ipAddress,
                    port,
                    ...(username && {username}),
                    ...(password && {password}),
                    ...(path && {path})
                }
                const cameraData = data ? 
                await updateCamera(data.id, dataToCreateUpdate) : 
                await createCamera(dataToCreateUpdate)

                callback(cameraData)

                setToastMessage({
                    "title": `Camera ${data ? "update": "create"} successfully!`, 
                    "description": `The camera was ${data ? "updated": "created"} successfully.`, 
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
                        }else if("ip_address" in data.message){
                            setIpAddressIsValid(false)
                            setToastMessage({
                                "title": "Ip Address invalid", 
                                "description": "The ip address field is invalid", 
                                success: false
                            })
                        }else if("port" in data.message){
                            setPortIsValid(false)
                            setToastMessage({
                                "title": "Port invalid", 
                                "description": "The port field is invalid", 
                                success: false
                            })
                        }else if("username" in data.message){
                            setUsernameIsValid(false)
                            setToastMessage({
                                "title": "Username invalid", 
                                "description": "The username field is invalid", 
                                success: false
                            })
                        }else if("password" in data.message){
                            setPasswordIsValid(false)
                            setToastMessage({
                                "title": "Password invalid", 
                                "description": "The password field is invalid", 
                                success: false
                            })
                        }else if("path" in data.message){
                            setPasswordIsValid(false)
                            setToastMessage({
                                "title": "Path invalid", 
                                "description": "The path field is invalid", 
                                success: false
                            })
                        }
                    }else{
                        const data: ErrorType = error.response?.data
                        if(data.error === "camera_already_exists"){
                            setNameIsValid(false)
                            setToastMessage({
                                "title": "Camera already exists", 
                                "description": data.message, 
                                success: false
                            })
                        }
                    }
                    setWasSubmitted(true)
                }else{
                    setToastMessage({
                        "title": `Failed to ${data ? "update": "create"} camera`, 
                        "description": `We couldn't ${data ? "update": "create"} the camera. Please try again later.`, 
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
        setName(data ? data.name : "")
        setNameIsValid(data ? true : false)

        setIpAddress(data ? data.ip_address : "")
        setIpAddressIsValid(data ? true : false)

        setPort(data ? data.port : 554)
        setPortIsValid(true)

        setUsername(data ? data.username : "")
        setUsernameIsValid(true)

        setPassword(data ? data.password : "")
        setPasswordIsValid(true)

        setPath(data ? data.path : "")
        setPathIsValid(true)

        setWasSubmitted(false)
    }, [showModal, data])

    return (
        <ModalBaseComponent
            title={data ? 'Edit camera' : 'Create camera'}
            description={data ? 'Update the camera settings and save your changes.' : 'Set up a new camera to start monitoring your environment.'}
            showModal={showModal}
            setShowModal={setShowModal}
            footer={
                <div className={styles.footer}>
                    <ButtonComponent 
                        className={styles.button}
                        text='Cancel' 
                        disabled={isLoading}
                        onClick={() => setShowModal(false)}
                    />
                    <ButtonComponent 
                        className={styles.button}
                        text={data ? "Save changes" : "Create camera"} 
                        disabled={isLoading}
                        isLoading={isLoading}
                        filled
                        icon={data ? <PiFloppyDisk /> : undefined}
                        form='form'
                    />
                </div>
            }
        >
            <div className={styles.wrapper}>
                <form id='form' className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.profileContainer}>
                        <div className={styles.profile} style={{backgroundColor: profileColor}}></div>
                        <HexColorPicker color={profileColor} onChange={setProfileColor} />
                    </div>
                    <InputComponent
                        type='text'
                        name='name'
                        id='name'
                        label='Name'
                        placeholder='Type camera name'
                        onChange={handleName}
                        value={name}
                        error={!nameIsValid && wasSubmitted}
                        disabled={isLoading}
                    />
                    <div className={styles.inputContainer}>
                        <InputComponent
                            type='text'
                            name='ip_address'
                            id='ip_address'
                            label='Ip Address'
                            placeholder='192.168.0.180'
                            onChange={handleIpAddress}
                            value={ipAddress}
                            error={!ipAddressIsValid && wasSubmitted}
                            disabled={isLoading}
                            maxLength={15}
                        />
                        <InputComponent
                            type='number'
                            name='port'
                            id='port'
                            label='Port'
                            placeholder='554'
                            onChange={handlePort}
                            value={port}
                            error={!portIsValid && wasSubmitted}
                            disabled={isLoading}
                            maxLength={5}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <InputComponent
                            type='text'
                            name='username'
                            id='username'
                            label='Username'
                            placeholder='admin'
                            onChange={handleUsername}
                            value={username}
                            error={!usernameIsValid && wasSubmitted}
                            disabled={isLoading}
                        />
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
                    <InputComponent
                        type='text'
                        name='path'
                        id='path'
                        label='Path'
                        placeholder='/live/ch00_0'
                        onChange={handlePath}
                        value={path}
                        error={!pathIsValid && wasSubmitted}
                        disabled={isLoading}
                    />
                </form>
            </div>
        </ModalBaseComponent>
    )
}

export default ModalCameraComponent