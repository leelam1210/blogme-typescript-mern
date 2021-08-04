import React from 'react';
import { googleLogin } from '../../redux/actions/authAction';
import { useDispatch } from 'react-redux';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login-lite';;


const SocialLogin = () => {
    const dispatch = useDispatch();

    const onSuccess = (googleUser: GoogleLoginResponse) => {
        const id_token = googleUser.getAuthResponse().id_token;
        // console.log(googleUser);
        dispatch(googleLogin(id_token));
    }



    return (
        <div className="my-2">
            <GoogleLogin
                client_id='612570224136-beu5rc6p2erfrudejapcm5e1lh50roic.apps.googleusercontent.com'
                cookiepolicy='single_host_origin'
                onSuccess={onSuccess}
            />
        </div>
    )
}

export default SocialLogin
// export { }