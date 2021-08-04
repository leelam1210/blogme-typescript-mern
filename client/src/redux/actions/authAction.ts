import { Dispatch } from 'redux';
import { IUserLogin, IUserRegister } from '../../utils/TypeScript';
import { loginApi, registerApi, refreshTokenApi, logoutApi, googleLoginApi, loginSMSApi, smsVerifyApi } from '../../api/FetchDataAuth';
import { AUTH, IAuthType } from '../types/authTypes';
import { ALERT, LOANGDING, IAlertType, ILoadingType } from '../types/alertType';
import { validPhone, validRegister } from '../../utils/Vaild';


export const login = (formLogin: IUserLogin) => async (dispatch: Dispatch<IAuthType | IAlertType | ILoadingType>) => {
    try {
        dispatch({ type: LOANGDING, payload: { loading: true } });

        const { data } = await loginApi(formLogin);
        console.log(data);
        dispatch({ type: AUTH, payload: data });

        dispatch({ type: ALERT, payload: { success: data.msg } });
        // alert('Đăng nhập thành công!!!');
        localStorage.setItem('logged', 'anhlam');

    } catch (error) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
}

export const register = (formAuth: IUserRegister) => async (dispatch: Dispatch<IAuthType | IAlertType | ILoadingType>) => {
    const check = validRegister(formAuth);
    console.log(check);
    if (check.errLength > 0)
        return dispatch({ type: ALERT, payload: { error: check.errMsg } });

    try {
        dispatch({ type: LOANGDING, payload: { loading: true } });

        const { data } = await registerApi(formAuth);
        console.log("register:", data);

        dispatch({ type: ALERT, payload: { success: data.msg } });
    } catch (error) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
}

export const refreshToken = () => async (dispatch: Dispatch<IAuthType | IAlertType | ILoadingType>) => {
    // const logged = JSON.parse(localStorage.getItem('profile'));
    const logged = localStorage.getItem('logged');
    if (logged !== 'anhlam') return;


    try {
        console.log("refreshTokenApi");
        dispatch({ type: ALERT, payload: { loading: true } });
        const { data } = await refreshTokenApi();
        console.log(data);
        dispatch({ type: AUTH, payload: data });

        dispatch({ type: ALERT, payload: {} });
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
}

export const logout = () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        localStorage.removeItem('logged');
        await logoutApi();
        window.location.href = "/login";
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { error: err.response.data.msg } });
    }
}

export const googleLogin = (id_token: string) => async (dispatch: Dispatch<IAuthType | IAlertType | ILoadingType>) => {
    try {
        dispatch({ type: LOANGDING, payload: { loading: true } });

        const { data } = await googleLoginApi({ id_token });

        console.log(data);

        dispatch({ type: AUTH, payload: data });

        dispatch({ type: ALERT, payload: { success: data.msg } });
        localStorage.setItem('logged', 'anhlam');

    } catch (error) {
        dispatch({ type: ALERT, payload: { error: error.response.data.message } });
        console.log(error);
    }
}


export const loginSMS = (phone: string) => async (dispatch: Dispatch<IAuthType | IAlertType | ILoadingType>) => {
    // console.log(phone);
    const check = validPhone(phone);
    // console.log(check);
    if (!check)
        return dispatch({ type: ALERT, payload: { error: 'Phone number format is incorrect.' } });

    try {
        dispatch({ type: LOANGDING, payload: { loading: true } });

        const res = await loginSMSApi({ phone });

        console.log(res);

        if (!res.data.valid)
            verifySMS(phone, dispatch);

    } catch (error) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
}

export const verifySMS = async (phone: string, dispatch: Dispatch<IAuthType | IAlertType | ILoadingType>) => {
    const code = prompt('Enter your code');
    if (!code) return;

    try {
        dispatch({ type: LOANGDING, payload: { loading: true } });

        const { data } = await smsVerifyApi({ phone, code });
        console.log(data);
        dispatch({ type: AUTH, payload: data });

        dispatch({ type: ALERT, payload: { success: data.msg } });
        localStorage.setItem('logged', 'anhlam');
    } catch (error) {
        console.log(error.response);
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
        // dispatch({ type: LOANGDING, payload: { loading: false } });
        setTimeout(() => {
            verifySMS(phone, dispatch);
        }, 1000);
    }

}