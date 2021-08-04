import { IAlert } from '../../utils/TypeScript';

export const ALERT = 'ALERT';
export const LOANGDING = 'LOANGDING';

export interface IAlertType {
    type: typeof ALERT
    payload: IAlert
}

export interface ILoadingType {
    type: typeof LOANGDING
    payload: IAlert
}