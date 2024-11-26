import React from 'react'
import "./CreateAccount.css";

const CreateAccount = () => {
    return (
        <>
            <div className="create-account-wrapper">
                <form action="">
                    <div className="create-title-wrapper">
                        <p className="create-acc-title">Create a <span>Closed Sea</span> Account!</p>
                    </div>
                    <div className="lastname-wrapper">
                        <input placeholder='User Name' type="text" name='create-lastname' />
                    </div>
                    <div className="email-wrapper">
                        <input type="email" placeholder='Email' name="create-email" className='create-email' id="" />
                    </div>
                    <div className="password-wrapper">
                        <input type="password" placeholder='Password' name="create-password" id="" />
                    </div>
                    <div className="confirm-wrapper">
                        <input type="password" placeholder='Confirm Password' name="create-confirm-pass" id="" />
                    </div>
                    <input type="submit" value="Create" className='create-submit' />
                    <p className="login-account">Already have an account? Login here!</p>
                </form>
            </div>
        </>
    )
}

export default CreateAccount
