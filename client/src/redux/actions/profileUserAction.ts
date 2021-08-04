import { Dispatch } from "redux";
import { resetPasswordApi, updateUserApi } from "../../api/FetchDataAuth";
import { checkImage, imageUpload } from "../../utils/ImageUpload";
import { checkPassword } from "../../utils/Vaild";
import { ALERT, IAlertType, ILoadingType, LOANGDING } from "../types/alertType";
import { AUTH, IAuth, IAuthType } from "../types/authTypes";


export const updateUser = (avatar: File, name: string, auth: IAuth) => async (dispatch: Dispatch<IAuthType | IAlertType | ILoadingType>) => {
    // console.log({ avatar, name, auth });

    if (!auth.access_token || !auth.user) return;

    let url = '';

    try {
        dispatch({ type: LOANGDING, payload: { loading: true } });
        if (avatar) {
            const check = checkImage(avatar);
            console.log(check);

            if (check)
                return dispatch({ type: ALERT, payload: { error: check } });

            const photo = await imageUpload(avatar);
            console.log(photo);
            url = photo.url;
        }
        dispatch({
            type: AUTH,
            payload: {
                access_token: auth.access_token,
                user: {
                    ...auth.user,
                    avatar: url ? url : auth.user.avatar,
                    name: name ? name : auth.user.name
                }
            }
        });
        const res = await updateUserApi({
            avatar: url ? url : auth.user.avatar,
            name: name ? name : auth.user.name
        }, auth.access_token);

        console.log(res);
        dispatch({ type: ALERT, payload: { success: res.data.msg } });

        dispatch({ type: LOANGDING, payload: { loading: false } });
    } catch (error) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
};

export const resetPassword = (password: string, confirmPassword: string, token: string) => async (dispatch: Dispatch<IAuthType | IAlertType | ILoadingType>) => {

    const msg = checkPassword(password, confirmPassword);
    if (msg) return dispatch({ type: ALERT, payload: { error: msg } });

    try {
        dispatch({ type: LOANGDING, payload: { loading: true } });

        const res = await resetPasswordApi({ password }, token);

        dispatch({ type: ALERT, payload: { success: res.data.msg } });

    } catch (err: any) {
        dispatch({ type: ALERT, payload: { error: err.response.data.msg } });
    }
}