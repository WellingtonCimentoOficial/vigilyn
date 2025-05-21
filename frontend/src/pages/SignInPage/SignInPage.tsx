import React, { useContext, useEffect, useState } from 'react'
import styles from './SignInPage.module.css'
import ButtonComponent from '../../components/Buttons/ButtonComponent/ButtonComponent'
import LogoSimbolComponent from '../../components/Logos/LogoSimbolComponent/LogoSimbolComponent'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../contexts/AuthContext'
import { useBackendRequests } from '../../hooks/useBackRequests'
import { ToastContext } from '../../contexts/ToastContext'
import InputComponent from '../../components/Inputs/InputComponent/InputComponent'
import { emailRegex, passwordRegex } from '../../utils/regex'
import CheckBoxComponent from '../../components/Checkboxes/CheckBoxComponent/CheckBoxComponent'
import LogoFullComponent from '../../components/Logos/LogoFullComponent/LogoFullComponent'

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
        setEmail(e.target.value)
        setEmailIsValid(emailRegex.test(e.target.value))
        setWasSubmitted(false)
    }
    
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setPasswordIsValid(passwordRegex.test(e.target.value))
        setWasSubmitted(false)
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
                    setToastMessage({title: "Incorrect credentials", description: "The username or password is incorrect.", success: false})
                }else{
                    setToastMessage({title: "An error occurred", description: "Try refreshing the page and try again.", success: false})
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
                                <InputComponent
                                    type="text" 
                                    name="email" 
                                    id="email" 
                                    error={!emailIsValid && wasSubmitted}
                                    placeholder='email@email.com' 
                                    onChange={handleEmail}
                                    value={email}
                                    label='Email'
                                    disabled={isLoading}
                                />
                                <InputComponent
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    id="password" 
                                    error={!passwordIsValid && wasSubmitted }
                                    onChange={handlePassword}
                                    value={password}
                                    label='Password'
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    disabled={isLoading}
                                />
                                <CheckBoxComponent checked={remember} callback={(checked) => setRemember(checked)} label='Remember Me' />
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