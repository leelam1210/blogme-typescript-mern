import { AUTH, IAuth, IAuthType } from "../types/authTypes";

export const authReducer = (state: IAuth = {}, action: IAuthType): IAuth => {
    switch (action.type) {
        case AUTH:
            // localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
            return { ...action?.payload };
        default:
            return state;
    }
}

