import axios, { AxiosInstance, AxiosResponse } from 'axios';

// const uri: string = 'http://localhost:5000/api';
const API: AxiosInstance = axios.create({ baseURL: 'http://localhost:5000' });
// API.interceptors.request.use((req) => {
//     if (localStorage.getItem('profile')) {
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
//     }

//     return req;
// });
// export const postAPI = async (url: string, post: object, token?:string) => {
//     const res = await axios.post(`/api/${url}`, post, {
//       headers: { Authorization: token }
//     })

//     return res;
//}
export const loginApi = async (formLogin: object) => {
    const url: string = 'api/login';
    const res: AxiosResponse = await API.post(url, formLogin);
    return res;
};

export const registerApi = async (formLogin: object) => {
    const url: string = 'api/register';
    const res: AxiosResponse = await API.post(url, formLogin);
    return res;
};

export const activeAccount = async (formLogin: object) => {
    const url: string = 'api/active';
    const res: AxiosResponse = await API.post(url, formLogin);
    return res;
};

export const refreshTokenApi = async () => {
    const url: string = 'api/refresh_token';
    const res: AxiosResponse = await API.get(url);
    return res;
};

export const logoutApi = async () => {
    const url: string = 'api/logout';
    const res: AxiosResponse = await API.get(url);
    return res;
};

export const googleLoginApi = async (id_token: object) => {
    const url: string = 'api/google_login';
    const res: AxiosResponse = await API.post(url, id_token);
    return res;
};

export const loginSMSApi = async (phone: object) => {
    const url: string = 'api/login_sms';
    const res: AxiosResponse = await API.post(url, phone);
    return res;
};

export const smsVerifyApi = async (phone: object) => {
    const url: string = 'api/sms_verify';
    const res: AxiosResponse = await API.post(url, phone);
    return res;
};

export const updateUserApi = async (post: object, token?: string) => {
    const url: string = 'api/user';
    const res: AxiosResponse = await API.patch(url, post, {
        headers: { Authorization: token }
    });
    return res;
};


export const resetPasswordApi = async (post: object, token?: string) => {
    const url: string = 'api/reset_password';
    const res: AxiosResponse = await API.patch(url, post, {
        headers: { Authorization: token }
    });
    return res;
};