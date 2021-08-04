import React from 'react';
import { useParams } from 'react-router-dom';
import { IParams, RootStore } from '../../utils/TypeScript';
import { useSelector } from 'react-redux';

import UserInfo from '../../components/profile/UserInfo';
import OtherInfo from '../../components/profile/OtherInfo';
import UserBlogs from '../../components/profile/UserBlogs';

const Profile = () => {
    const { slug }: IParams = useParams();
    console.log({ userID: slug });
    const { auth } = useSelector((state: RootStore) => state);


    return (
        <div className="row my-3">
            <div className="col-md-5 mb-3">
                {
                    auth.user?._id === slug
                        ? <UserInfo />
                        : <OtherInfo />
                }
            </div>

            <div className="col-md-7">
                <UserBlogs />
            </div>
        </div>
    )
}

export default Profile
