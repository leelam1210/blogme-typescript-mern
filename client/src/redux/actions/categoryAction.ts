import { Dispatch } from 'react';
import { createCategoryApi, deleteCategoryApi, getCategoriesApi, updateCategoryApi } from '../../api/CatagoriesApi';
import { ICategory } from '../../utils/TypeScript';
import { ALERT, IAlertType, ILoadingType, LOANGDING } from '../types/alertType';
import { CREATE_CATEGORY, GET_CATEGORIES, UPDATE_CATEGORY, ICategoryType, DELETE_CATEGORY } from '../types/categoryType';

export const createCategory = (name: string, token: string) => async (dispatch: Dispatch<ICategoryType | IAlertType | ILoadingType>) => {
    try {

        dispatch({ type: LOANGDING, payload: { loading: true } });
        const res = await createCategoryApi({ name }, token);

        dispatch({
            type: CREATE_CATEGORY,
            payload: res.data.newCategory
        });

        dispatch({ type: LOANGDING, payload: { loading: false } });
    } catch (error) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
}

export const getCategories = () => async (dispatch: Dispatch<ICategoryType | IAlertType | ILoadingType>) => {
    try {

        dispatch({ type: LOANGDING, payload: { loading: true } });
        const res = await getCategoriesApi();
        console.log(res);

        dispatch({
            type: GET_CATEGORIES,
            payload: res.data.categories,
        });

        dispatch({ type: LOANGDING, payload: { loading: false } });
    } catch (error) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
}

export const updateCategory = (data: ICategory, token: string) => async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    try {

        dispatch({ type: UPDATE_CATEGORY, payload: data });
        await updateCategoryApi(data._id, { name: data.name }, token);

    } catch (error) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
}

export const deleteCategory = (id: string, token: string) => async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    try {

        dispatch({ type: DELETE_CATEGORY, payload: id });
        await deleteCategoryApi(id, token);

    } catch (err: any) {
        dispatch({ type: ALERT, payload: { error: err.response.data.msg } });
    }
}