import React, { useEffect, useRef, useState } from 'react'
import styles from "./DropdownFilterComponent.module.css"
import ButtonFilterComponent from '../../Buttons/ButtonFilterComponent/ButtonFilterComponent'
import CheckBoxSwitchComponent from '../../Checkboxes/CheckBoxSwitchComponent/CheckBoxSwitchComponent'
import { CheckBoxFilterType } from '../../../types/FrontendTypes'

type Props = {
    show: boolean
    data: CheckBoxFilterType[]
    callbackShow: (value?: boolean) => void
    callback: (id: number, checked: boolean) => void
}

type CheckType = {
    id: number
    checked: boolean
}

const DropdownFilterComponent = ({show, data, callback, callbackShow}: Props) => {
    const [checkedItems, setCheckedItems] = useState<CheckType[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

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
        setCheckedItems(data.map(item => ({
            id: item.id,
            checked: item.value
        })))
    }, [data])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                callbackShow(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [callbackShow])
    
    return (
        <div className={styles.containerOptions} ref={containerRef}>
            <ButtonFilterComponent 
                text='Filters' 
                count={checkedItems.filter(item => item.checked).length}
                onClick={() => callbackShow()}
            />
            <div 
                className={`${styles.subContainerOptions} ${show ? styles.subContainerOptionsShow : ""}`} >
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