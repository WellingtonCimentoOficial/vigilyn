import React, { useContext, useEffect, useState } from 'react'
import styles from './SignInPage.module.css'
import LogoFullComponent from '../../components/LogoFullComponent/LogoFullComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import LogoSimbolComponent from '../../components/LogoSimbolComponent/LogoSimbolComponent'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../contexts/AuthContext'
import { useBackendRequests } from '../../hooks/useBackRequests'
import { ToastContext } from '../../contexts/ToastContext'
import { PiEye, PiEyeSlash } from "react-icons/pi";

type Props = {}

const SignInPage = (props: Props) => {
    const [email, setEmail] = useState<string>("")
    const [emailIsValid, setEmailIsValid] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [remember, setRemember] = useState<boolean>(false)
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const { setTokens, setIsAuthenticated, isAuthenticated, createSession } = useContext(AuthContext)
    const { setToastMessage } = useContext(ToastContext)
    const { signIn } = useBackendRequests()

    const navigate = useNavigate()
    
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        setEmail(e.target.value)
        setEmailIsValid(regex.test(e.target.value))
        setWasSubmitted(false)
        setPasswordIsValid(true)
    }
    
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        setPassword(e.target.value)
        setPasswordIsValid(regex.test(e.target.value))
        setWasSubmitted(false)
        setEmailIsValid(true)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true)
        e.preventDefault()
        if(emailIsValid && passwordIsValid && !isLoading){
            try {
                const data = await signIn(email, password)
                if(remember){
                    createSession(data)
                }else{
                    setTokens(data)
                    setIsAuthenticated(true)
                }
                navigate("/dashboard")
            } catch (error: any) {
                const status = error.response?.status
                const data = error.response?.data
                if(status === 400 && data.error === "invalid_username_or_password"){
                    setEmailIsValid(false)
                    setPasswordIsValid(false)
                    setWasSubmitted(true)
                }else{
                    setToastMessage({title: "An error occurred", description: "try refreshing the page and try again", success: false})
                }
            }
        }else{
            setWasSubmitted(true)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if(isAuthenticated){
            navigate("/dashboard")
        }
    }, [isAuthenticated, navigate])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.container1}>
                    <div className={styles.header}>
                        <LogoFullComponent className={styles.logo} />
                    </div>
                    <div className={styles.body}>
                        <div className={styles.bodyHeader}>
                            <h2 className={styles.title}>Welcome Back</h2>
                            <span className={styles.description}>Enter your email and password to access your account.</span>
                        </div>
                        <div className={styles.bodyBody}>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.containerInput}>
                                    <label htmlFor="email" className={styles.label}>Email</label>
                                    <input 
                                        type="text" 
                                        name="email" 
                                        id="email" 
                                        className={`${styles.input} ${!emailIsValid && wasSubmitted ? styles.inputError : ""}`} 
                                        placeholder='email@email.com' 
                                        onChange={handleEmail}
                                        value={email}
                                    />
                                </div>
                                <div className={styles.containerInput}>
                                    <label htmlFor="password" className={styles.label}>Password</label>
                                    <div className={styles.inputWra}>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password" 
                                            id="password" 
                                            className={`${styles.input} ${!passwordIsValid && wasSubmitted ? styles.inputError : ""}`} 
                                            placeholder='********' 
                                            onChange={handlePassword}
                                            value={password}
                                        />
                                        <div className={styles.inputIconContainer}>
                                            {showPassword ? (
                                                <PiEyeSlash className={styles.inputIcon} onClick={() => setShowPassword(value => !value)} />
                                            ):(
                                                <PiEye className={styles.inputIcon} onClick={() => setShowPassword(value => !value)} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.containerCheckBox}>
                                    <input 
                                        className={styles.inputCheckBox} 
                                        type="checkbox" 
                                        name="remember" 
                                        id="remember" 
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                    />
                                    <label className={styles.labelCheckBox} htmlFor="remember">Remember Me</label>
                                </div>
                                <ButtonComponent 
                                    text='Log In' 
                                    filled 
                                    className={styles.button} 
                                    disabled={isLoading}
                                />
                            </form>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <span className={styles.footerText}>Copyright &copy; Vigilyn</span>
                        <span className={styles.footerText}>Privacy Policy</span>
                    </div>
                </div>
                <div className={styles.container2}>
                    <LogoSimbolComponent className={styles.logoSimbol} />
                </div>
            </div>
        </div>
    )
}

export default SignInPage