import LoginForm from '../components/auth/LoginForm';


const Login = () => {


    return (
        <div className="auth_page">
            <LoginForm isSignups={false} />
        </div>
    )
}

export default Login;