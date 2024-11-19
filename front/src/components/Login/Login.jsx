import React from 'react'
import "./Login.css";

const Login = () => {
    return (
        <>
            <div className="login-wrapper">
                <form action="">
                    <div className="login-title-wrapper">
                        <p className="login-title">Sign in to <span>Closed Sea</span></p>
                    </div>
                    <div className="username-wrapper">
                        <input placeholder='Username' type="text" name='login-username' />
                    </div>
                    <div className="password-wrapper">
                        <input type="password" placeholder='Password' name="login-password" id="" />
                    </div>
                    <input type="submit" value="Login" className='login-submit'/>
                    <p className="create-account">New here? Create an account!</p>
                </form>
            </div>
        </>
    )
}

export default Login
