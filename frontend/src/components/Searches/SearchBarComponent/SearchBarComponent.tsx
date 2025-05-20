import React from 'react'
import styles from "./SearchBarComponent.module.css"
import { PiMagnifyingGlass } from "react-icons/pi";

type Props = React.InputHTMLAttributes<HTMLInputElement>

const SearchBarComponent = ({type, placeholder, ...rest}: Props) => {
    return (
        <div className={styles.wrapper}>
            <input className={styles.input} type="text" placeholder='Search for something...' {...rest} />
            <div className={styles.iconContainer}>
                <PiMagnifyingGlass className={styles.icon} />
            </div>
        </div>
    )
}

export default SearchBarComponent