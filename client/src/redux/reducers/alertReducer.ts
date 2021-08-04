import { ALERT, IAlertType, LOANGDING, ILoadingType } from '../types/alertType';
import { IAlert } from '../../utils/TypeScript';


const alertReducer = (state: IAlert = {}, action: IAlertType | ILoadingType): IAlert => {
    switch (action.type) {
        case ALERT:
            return action.payload;
        case LOANGDING:
            return action.payload;
        default:
            return state
    }
}

export default alertReducer;