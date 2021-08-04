import { Request, Response } from "express";
import Users from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateActiveToken, generateRefreshToken } from "../config/generateToken";
import sendMail from '../config/sendMail';
import { validateEmail, validPhone } from '../middlewares/vaild';
import { sendSms, smsOTP, smsVerify } from '../config/sendSMS';
import { IDecodedToken, IGgPayload, IUser, IUserParams } from '../config/interface';
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);

const CLIENT_URL = `${process.env.BASE_URL}`;

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, account, password } = req.body;

        const user = await Users.findOne({ account });
        if (user)
            return res
                .status(400)
                .json({ msg: "Email or Phone number already exists." });

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = new Users({ name: `${firstName} ${lastName}`, account, password: passwordHash });

        const active_token = generateActiveToken({ newUser });

        const url = `${CLIENT_URL}/active/${active_token}`;

        // gui mail xac nhan

        if (validateEmail(account)) {
            sendMail(account, url, "Verify your email address");
            return res.json({ msg: "Success! Please check your email.", active_token: active_token });

        } else if (validPhone(account)) {
            sendSms(account, url, "Verify your phone number");
            console.log(active_token);
            return res.json({ msg: "Success! Please check phone.", active_token: active_token });
        }

        res.json({
            status: "OK",
            msg: "Register successfully.",
            data: newUser,
            active_token: active_token,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const activeAccount = async (req: Request, res: Response) => {
    try {
        const { active_token } = req.body;

        const { newUser } = <IDecodedToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);

        // const { newUser } = decoded;
        console.log(newUser);

        if (!newUser) return res.status(400).json({ msg: "Invalid authentication." });

        const user = await Users.findOne({ account: newUser.account });
        if (user) return res.status(400).json({ msg: "This account has been verified." });

        const new_user = new Users(newUser);

        await new_user.save();

        res.json({ msg: "Account has been activated!" });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
        // let errMsg;

        // if (err.code === 11000) {
        //     errMsg = Object.keys(err.keyValue)[0] + " already exists.";
        // } else {
        //     let name = Object.keys(err.errors)[0]
        //     errMsg = err.errors[`${name}`].message
        // }

        // return res.status(500).json({ msg: errMsg });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { account, password } = req.body;
        if (!account || !password)
            return res
                .status(400)
                .json({ success: false, msg: 'Missing username and/or password' });

        const user = await Users.findOne({ account });
        if (!user) return res.status(400).json({ msg: 'This account does not exits.' });

        // if user exists
        loginUser(user, password, res);

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

const loginUser = async (user: IUser, password: string, res: Response) => {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        let msgError = user.type === 'register'
            ? 'Password is incorrect.'
            : `Password is incorrect. This account login with ${user.type}`;

        return res.status(400).json({ msg: msgError });
    }

    // const access_token = jwt.sign({ id: user._id }, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '15m' });
    const access_token = generateAccessToken({ id: user._id });
    const refresh_token = generateRefreshToken({ id: user._id });
    // const refresh_token = jwt.sign({ id: user._id }, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '30d' })


    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        secure: true,
        path: `/api/refresh_token`,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
    })

    res.json({
        msg: 'Login Success!',
        access_token: access_token,
        refresh_token: refresh_token,
        user: { ...user._doc, password: '' }
    });
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('refreshtoken', { path: `/api/refresh_token` });
        return res.json({ msg: "Logged out!" });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        console.log(rf_token);
        console.log("req:", req.cookies);
        if (!rf_token) return res.status(400).json({ msg: "Please login now!" });
        const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`);
        if (!decoded.id) return res.status(400).json({ msg: "Please login now!" });
        console.log(decoded);

        const user = await Users.findById(decoded.id).select("-password");
        // console.log(user);
        if (!user) return res.status(400).json({ msg: "This account does not exist." });

        const access_token = generateAccessToken({ id: user._id });

        res.json({ access_token: access_token, user: user, msg: "Success!" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { id_token } = req.body;

        console.log(id_token);

        const verify = await client.verifyIdToken({
            idToken: id_token, audience: `${process.env.MAIL_CLIENT_ID}`
        })

        const {
            email, email_verified, name, picture
        } = <IGgPayload>verify.getPayload();

        if (!email_verified)
            return res.status(500).json({ msg: "Email verification failed." })

        const password = email + 'your google secrect password';
        const passwordHash = await bcrypt.hash(password, 12);

        const user = await Users.findOne({ account: email });

        if (user) {
            loginUser(user, password, res);
        } else {
            const user = {
                name,
                account: email,
                password: passwordHash,
                avatar: picture,
                type: 'logingoogle'
            }
            registerUser(user, res);
        }

    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
};

export const loginSms = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;
        console.log(phone);

        // const user = await Users.findOne({ account: phone });

        const data = await smsOTP(phone, 'sms');
        // console.log(data);
        res.json(data)
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
};

export const Smsverify = async (req: Request, res: Response) => {
    try {
        const { phone, code } = req.body;

        const data = await smsVerify(phone, code);

        if (!data?.valid) return res.status(400).json({ msg: "Invalid Authentication." });

        const password = phone + 'your phone secrect password';
        const passwordHash = await bcrypt.hash(password, 12);

        const user = await Users.findOne({ account: phone });
        // console.log(user?.password);

        if (user) {
            if (user.type !== 'loginsms') {
                return res.status(400).json({ msg: 'Số điện thoại này đã được đăng ký với tài khoản khác. Đăng nhập với mật khẩu!.' });
            } else {
                loginUser(user, password, res);

            }
            // console.log(msg);

        } else {
            const user = {
                name: phone,
                account: phone,
                password: passwordHash,
                type: 'loginsms'
            }
            registerUser(user, res);
        }

    } catch (err: any) {
        return res.status(500).json({ msg: err.message })
    }
};

const registerUser = async (user: IUserParams, res: Response) => {
    const newUser = new Users(user);
    await newUser.save();

    const access_token = generateAccessToken({ id: newUser._id });
    const refresh_token = generateRefreshToken({ id: newUser._id });

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: `/api/refresh_token`,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
    });

    res.json({
        msg: 'Login Success!',
        access_token,
        user: { ...newUser._doc, password: '' }
    });

};
