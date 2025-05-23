import React, { useEffect, useState } from 'react'
import styles from "./DropdownFilterComponent.module.css"
import ButtonFilterComponent from '../../Buttons/ButtonFilterComponent/ButtonFilterComponent'
import CheckBoxSwitchComponent from '../../Checkboxes/CheckBoxSwitchComponent/CheckBoxSwitchComponent'
import { CameraFilterType } from '../../../types/FrontendTypes'

type Props = {
    show: boolean
    data: CameraFilterType[]
    callbackShow: (value?: boolean) => void
    callback: (id: number, checked: boolean) => void
}

type CheckType = {
    id: number
    checked: boolean
}

const DropdownFilterComponent = ({show, data, callback, callbackShow}: Props) => {
    const [checkedItems, setCheckedItems] = useState<CheckType[]>([])

    const handleCheck = (id: number) => {
        const itemCheck = checkedItems.find(item => item.id === id)
        if(itemCheck){
            const itemCheckInverted = {...itemCheck, checked: !itemCheck.checked}
            setCheckedItems(prev =>
                prev.map(item => item.id === id ? itemCheckInverted : item)
            )
            callback(id, itemCheckInverted.checked)
        }
    }
    
    useEffect(() => {
        if(checkedItems.length === 0){
            for(let i=0; i < data.length; i++){
                setCheckedItems(prev => [...prev, {id: data[i].id, checked: data[i].value}])
            }
        }
    }, [data, checkedItems])
    
    return (
        <div className={styles.wrapper} >
            <ButtonFilterComponent 
                text='Filters' 
                count={checkedItems.filter(item => item.checked).length}
                onClick={() => callbackShow()}
            />
            <div 
                className={`${styles.subContainerOptions} ${show ? styles.subContainerOptionsShow : ""}`} 
                tabIndex={1} onBlur={() => callbackShow(false)}
            >
                {data.map(item => (
                    <div key={item.id} className={styles.option}>
                        <CheckBoxSwitchComponent 
                            checked={checkedItems.find(check => check.id === item.id)?.checked ?? false} 
                            callback={() => handleCheck(item.id)}
                            size={3}
                        />
                        <span className={styles.optionText}>{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DropdownFilterComponent