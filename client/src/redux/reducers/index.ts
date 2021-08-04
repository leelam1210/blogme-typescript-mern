import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import { authReducer } from './authReducer';
import categoryReducer from "./categoryReducer";

export const rootReducer = combineReducers({
    auth: authReducer,
    alert: alertReducer,
    categories: categoryReducer,
});