import axios, { AxiosInstance, AxiosResponse } from 'axios';

// const uri: string = 'http://localhost:5000/api';
const API: AxiosInstance = axios.create({ baseURL: 'http://localhost:5000' });

export const getCategoriesApi = async () => {
    const url: string = 'api/category';
    const res: AxiosResponse = await API.get(url);
    return res;
};

export const createCategoryApi = async (category: object, token?: string) => {
    const url: string = 'api/category';
    const res: AxiosResponse = await API.post(url, category, {
        headers: { Authorization: token }
    });
    return res;
};

export const updateCategoryApi = async (id: string, category: object, token?: string) => {
    const url: string = `api/category/${id}`;
    const res: AxiosResponse = await API.patch(url, category, {
        headers: { Authorization: token }
    });
    return res;
};

export const deleteCategoryApi = async (id: string, token?: string) => {
    const url: string = `api/category/${id}`;
    const res: AxiosResponse = await API.delete(url, {
        headers: { Authorization: token }
    });
    return res;
};


