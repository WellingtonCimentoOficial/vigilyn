import React, { useState } from 'react'
import styles from "./SelectComponent.module.css"
import { SelectType } from '../../../types/FrontendTypes'
import { PiCaretDown, PiCaretUp } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion"


const SelectComponent = ({value, data, callback}: SelectType) => {
    const [showOptions, setShowOptions] = useState<boolean>(false)

    return (
        <AnimatePresence>
            <div className={styles.wrapper} tabIndex={1} onBlur={() => setShowOptions(false)}>
                <div 
                    className={styles.header} onClick={() => setShowOptions(current => !current)} >
                    <span className={styles.title}>{value}</span>
                    {showOptions ? (
                        <PiCaretUp className={styles.icon} />
                    ):(
                        <PiCaretDown className={styles.icon} />
                    )}
                </div>
                {showOptions &&
                    <motion.ul 
                        className={styles.listOptions}
                        initial={{y: -5, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -5, opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        {data.map(item => (
                            <li 
                                key={item.id} 
                                className={styles.option} 
                                onClick={() => {callback(item);setShowOptions(false)}}
                            >
                                {item.title}
                            </li>
                        ))}
                    </motion.ul>
                }
            </div>
        </AnimatePresence>
    )
}

export default SelectComponent