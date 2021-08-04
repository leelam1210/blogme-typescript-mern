import { CREATE_CATEGORY, DELETE_CATEGORY, GET_CATEGORIES, ICategoryType, UPDATE_CATEGORY } from "../types/categoryType";
import { ICategory } from '../../utils/TypeScript';



const categoryReducer = (state: ICategory[] = [], action: ICategoryType): ICategory[] => {
    switch (action.type) {
        case CREATE_CATEGORY:
            return [action.payload, ...state];

        case GET_CATEGORIES:
            return action.payload;
        case UPDATE_CATEGORY:
            return state.map((category) => category._id === action.payload._id ? { ...category, name: action.payload.name } : category);
        case DELETE_CATEGORY:
            return state.filter((category) => category._id !== action.payload);
        default:
            return state;
    }
}

export default categoryReducer;