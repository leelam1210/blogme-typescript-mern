import React from 'react'
import LoginForm from '../components/auth/LoginForm'

const Register = () => {
    return (
        <div className="auth_page">
            <LoginForm isSignups={true} />
        </div>
    )
}

export default Register