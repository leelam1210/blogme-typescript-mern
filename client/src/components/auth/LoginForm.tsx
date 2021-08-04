import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../../redux/actions/authAction';

import { RootStore } from '../../utils/TypeScript';
import SocicalLogin from "./SocicalLogin";
import { loginSMS } from '../../redux/actions/authAction';

interface IPropsSetForm {
    isSignups: boolean;
}

const LoginForm = ({ isSignups }: IPropsSetForm) => {
    const initialState = { account: "", password: "", confirmPassword: "", phone: '', firstName: '', lastName: '' };
    const [formAuth, setFormAuth] = useState(initialState);
    const { account, password, firstName, lastName, phone, confirmPassword } = formAuth;
    // const [phone, setPhone] = useState('');

    const dispatch = useDispatch();
    const history = useHistory();
    const { auth } = useSelector((state: RootStore) => state);

    const [typePass, setTypePass] = useState(false);
    const [sms, setSms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(isSignups);

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setFormAuth({ ...formAuth, [name]: value });
        // setLoginformAuth({...loginformAuth, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!isSignup && !sms) {
            console.log(formAuth);
            dispatch(login(formAuth));
        } else if (isSignup) {
            console.log('register');
            dispatch(register(formAuth));
        }
        if (sms) {
            console.log("phone:", phone);
            dispatch(loginSMS(phone));
        }

    }

    useEffect(() => {
        if (auth.access_token) history.push('/');
    }, [auth.access_token, history]);

    return (
        <div className="auth_box">
            <h3 className="text-uppercase text-center mb-4">{isSignup ? 'Register' : 'Login'}</h3>

            <form onSubmit={handleSubmit}>
                <SocicalLogin />

                {isSignup && (
                    <div className="d-inline-flex">
                        <div className="form-group mb-3">
                            <label htmlFor="name" className="form-label">First Name</label>

                            <input type="text" className="form-control" id="name"
                                name="firstName" value={firstName} onChange={handleChangeInput}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="name" className="form-label">Last Name</label>

                            <input type="text" className="form-control" id="name"
                                name="lastName" value={lastName} onChange={handleChangeInput}
                            />
                        </div>
                    </div>
                )}

                {!sms ?
                    <>
                        <div className="form-group mb-3">
                            <label htmlFor="account" className="form-label">
                                Email / Phone number
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="account"
                                name="account"
                                value={account}
                                onChange={handleChangeInput}
                                placeholder="example@gmail.com"
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>

                            <div className="pass">
                                <input
                                    type={typePass ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChangeInput}
                                    placeholder="Password must be at least 6 chars."
                                />

                                <small onClick={() => setTypePass(!typePass)}>
                                    {typePass ? "Hide" : "Show"}
                                </small>
                            </div>
                        </div>

                        {isSignup && (
                            <div className="form-group mb-3">
                                <label htmlFor="password" className="form-label">
                                    Confirm Password
                                </label>

                                <div className="pass">
                                    <input
                                        type={typePass ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleChangeInput}
                                        placeholder="Password must be at least 6 chars."
                                    />

                                    <small onClick={() => setTypePass(!typePass)}>
                                        {typePass ? "Hide" : "Show"}
                                    </small>
                                </div>
                            </div>
                        )}
                    </> :

                    <div className="form-group mb-3">
                        <label htmlFor="account" className="form-label">
                            Phone number
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={handleChangeInput}
                            placeholder="+84"
                        />
                    </div>
                }




                <button
                    type="submit"
                    className="btn btn-dark w-100 mt-1 my-3"
                // disabled={(account && password) || phone ? false : true}
                >
                    {isSignup ? (loading ? 'Register...' : 'Register') : (loading ? 'Login...' : 'Login')}

                </button>
                {!isSignup && (
                    <small className="row my-2 text-primary" style={{ cursor: "pointer" }}>
                        <span className="col-6">
                            <Link to="/forgot_password">{!sms ? "Forgot password?" : "Forgot phone number?"}</Link>
                        </span>

                        <span className="col-6 text-end" onClick={() => setSms(!sms)}>
                            {sms ? "Sign in with password" : "Sign in with SMS"}
                        </span>
                    </small>
                )}

                <p>
                    {isSignup ? "Already have an account?" : "You don't have an account?"}

                    {isSignup ? <Link to="/login" style={{ color: "crimson" }} onClick={() => setIsSignup(!isSignup)}>
                        &nbsp;Login Now
                    </Link> :
                        <Link to="/register" style={{ color: "crimson" }} onClick={() => setIsSignup(!isSignup)}>
                            &nbsp;Register Now
                        </Link>
                    }
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
