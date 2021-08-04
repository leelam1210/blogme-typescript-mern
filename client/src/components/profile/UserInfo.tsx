import React, { ChangeEvent, FormEvent, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, resetPassword } from "../../redux/actions/profileUserAction";
import { RootStore, IUserProfile } from "../../utils/TypeScript";

import NotFound from "../global/NotFound";

const UserInfo = () => {
    const { auth } = useSelector((state: RootStore) => state);
    const dispatch = useDispatch();
    const initialState = {
        name: "",
        account: "",
        avatar: "",
        password: "",
        confirmPassword: "",
    };

    const [user, setUser] = useState<IUserProfile>(initialState);
    const [typePass, setTypePass] = useState<Boolean>(false);
    const [typeconfirmPassword, setTypeConfirmPassword] = useState<Boolean>(false);
    const { name, avatar, password, confirmPassword } = user;

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        // setUser({...user, [e.target.name] : e.target.value});
    };

    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        console.log(files);
        if (files) {
            const file = files[0];
            setUser({ ...user, avatar: file });
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (avatar || name)
            dispatch(updateUser((avatar as File), name, auth));

        if (password && auth.access_token)
            dispatch(resetPassword(password, confirmPassword, auth.access_token));

    };

    if (!auth.user) return <NotFound />;

    return (
        <form className="profile_info" onSubmit={handleSubmit}>
            <div className="info_avatar">
                <img
                    src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                    alt="avatar"
                />

                <span>
                    <i className="fas fa-camera" />
                    <p>Change</p>
                    <input
                        type="file"
                        accept="image/*"
                        name="file"
                        id="file_up"
                        onChange={handleChangeFile}
                    />
                </span>
            </div>

            <div className="form-group my-3">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    defaultValue={auth.user.name}
                    onChange={handleChangeInput}
                />
            </div>

            <div className="form-group my-3">
                <label htmlFor="account">Account</label>
                <input
                    type="text"
                    className="form-control"
                    id="account"
                    name="account"
                    defaultValue={auth.user.account}
                    onChange={handleChangeInput}
                    disabled={true}
                />
            </div>

            {
                auth.user.type !== 'register' &&
                <small className="text-danger">
                    * Quick login account with {auth.user.type} can't use this function *
                </small>
            }


            <div className="form-group my-3">
                <label htmlFor="password">Password</label>

                <div className="pass">
                    <input
                        type={typePass ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChangeInput}
                        disabled={auth.user.type !== 'register'}
                    />

                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? "Hide" : "Show"}
                    </small>
                </div>
            </div>

            <div className="form-group my-3">
                <label htmlFor="confirmPassword">Confirm Password</label>

                <div className="pass">
                    <input
                        type={typePass ? "text" : "password"}
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChangeInput}
                        disabled={auth.user.type !== 'register'}
                    />

                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? "Hide" : "Show"}
                    </small>
                </div>
            </div>

            <button className="btn btn-dark w-100" type="submit">
                Update
            </button>
        </form>
    );
};

export default UserInfo;
