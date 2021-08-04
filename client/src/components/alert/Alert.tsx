import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootStore } from '../../utils/TypeScript';

import Loading from './Loading';
import Toast from './Toast';

export const Alert = () => {
    const { alert } = useSelector((state: RootStore) => state);

    return (
        <div>
            {alert.loading && <Loading />}

            {
                alert.error &&
                <Toast
                    title="Errors"
                    body={alert.error}
                    bgColor="bg-danger"
                />
            }

            {
                alert.success &&
                <Toast
                    title="Success"
                    body={alert.success}
                    bgColor="bg-success"
                />
            }
        </div>
    )
}

export const showErrMsg = (msg: string) => {
    return <div className="errMsg">{msg} <Link to="/register" >Try again with another account!</Link></div>
}

export const showSuccessMsg = (msg: string) => {
    return <div className="successMsg">{msg} <Link to="/">Go to Home</Link></div>
}