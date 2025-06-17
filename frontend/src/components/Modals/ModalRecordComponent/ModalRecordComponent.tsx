import React, { useContext, useEffect, useState } from 'react'
import styles from "./ModalRecordComponent.module.css"
import ModalBaseComponent from '../ModalBaseComponent/ModalBaseComponent'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'
import { PiFloppyDisk } from "react-icons/pi";
import { ErrorType, ErrorValidationType, RecordType } from '../../../types/BackendTypes';
import InputComponent from '../../Inputs/InputComponent/InputComponent';
import { ToastContext } from '../../../contexts/ToastContext';
import { useBackendRequests } from '../../../hooks/useBackRequests';


type Props = {
    showModal: boolean
    data: RecordType
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    callback: (record: RecordType) => void
}

const ModalRecordComponent = ({data, showModal, callback, setShowModal}: Props) => {
    const [name, setName] = useState<string>(data.name)
    const [nameIsValid, setNameIsValid] = useState<boolean>(false)

    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { updateRecord } = useBackendRequests()
    const { setToastMessage } = useContext(ToastContext)

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        setNameIsValid(e.target.value.length >= 3 && e.target.value.length <= 130)
        setWasSubmitted(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        if(nameIsValid){
            try {
                const recordData = await updateRecord(data.id, {name})

                callback(recordData)

                setToastMessage({
                    "title": "Record updated successfully!", 
                    "description": "The record was updated successfully.", 
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
                                "description": "The name field is invalid. It must contain between 10 and 130 characters.", 
                                success: false
                            })
                        }else{
                            setToastMessage({
                                "title": "Failed to update record", 
                                "description": "We couldn't update the record. Please try again later.", 
                                success: false
                            })
                        }
                    }else{
                        const data: ErrorType = error.response?.data
                        if(data.error === "record_already_exists"){
                            setNameIsValid(false)
                            setToastMessage({
                                "title": "Record already exists", 
                                "description": data.message, 
                                success: false
                            })
                        }
                    }
                    setWasSubmitted(true)
                }else{
                    setToastMessage({
                        "title": "Failed to update record", 
                        "description": "We couldn't update the record. Please try again later.", 
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
        setName(data.name)
        setNameIsValid(true)
    }, [showModal, data])

    return (
        <ModalBaseComponent
            title='Edit record'
            description="Update the record's information as needed."
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
                        text="Save changes"
                        disabled={isLoading}
                        isLoading={isLoading}
                        filled
                        icon={<PiFloppyDisk />}
                        form='form'
                    />
                </div>
            }
        >
            <div className={styles.wrapper}>
                <form id='form' className={styles.form} onSubmit={handleSubmit}>
                    <InputComponent
                        type='text'
                        name='name'
                        id='name'
                        label='Name'
                        placeholder='Type record name'
                        onChange={handleName}
                        value={name}
                        error={!nameIsValid && wasSubmitted}
                        disabled={isLoading}
                    />
                </form>
            </div>
        </ModalBaseComponent>
    )
}

export default ModalRecordComponent