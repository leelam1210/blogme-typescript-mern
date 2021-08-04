import { rootReducer } from '../redux/reducers/index';

export type RootStore = ReturnType<typeof rootReducer>;

export interface IParams {
    page: string
    slug: string
}

export interface IUserLogin {
    account: string
    password: string
};

export interface IUserRegister extends IUserLogin {
    confirmPassword: string
    firstName: string
    lastName: string
    // name: {
    //     firstName: string
    //     lastName: string
    // }

};

export interface IUser extends IUserLogin {
    avatar: string
    createdAt: string
    name: string
    role: string
    type: string
    updatedAt: string
    _id: string
};

export interface IUserProfile extends IUserLogin {
    avatar: string | File
    confirmPassword: string
    name: string
};

// export interface IUserProfile extends IUserRegister {
//     avatar: string | File
//   };

export interface IAlert {
    loading?: boolean
    success?: string | string[]
    error?: string | string[]
};
// export interface ILoading {
//     loading?: boolean
// }


export interface ICategory {
    _id: string
    name: string
    createdAt: string
    updatedAt: string
};