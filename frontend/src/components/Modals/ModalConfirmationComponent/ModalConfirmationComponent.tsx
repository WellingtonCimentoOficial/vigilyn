import React from 'react'
import styles from "./ModalConfirmationComponent.module.css"
import ModalBaseComponent from '../ModalBaseComponent/ModalBaseComponent'
import ButtonComponent from '../../Buttons/ButtonComponent/ButtonComponent'

type Props = {
    title?: string
    description?: string
    showModal: boolean
    isLoading?: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    callback: () => void
}

const ModalConfirmationComponent = ({title, description, showModal, isLoading, setShowModal, callback}: Props) => {
    return (
        <ModalBaseComponent 
            title={title ?? 'Confirm deletion' }
            description={description ?? 'Are you sure you want to delete this item? This action cannot be undone.'}
            showModal={showModal}
            setShowModal={setShowModal}
        >
            <div className={styles.wrapper}>
                <ButtonComponent text='Cancel' onClick={() => setShowModal(false)} />
                <ButtonComponent 
                    text='Confirm' 
                    filled 
                    onClick={() => {callback();setShowModal(false)}}
                    disabled={isLoading}
                    isLoading={isLoading}
                />
            </div>
       </ModalBaseComponent>
    )
}

export default ModalConfirmationComponent