import { Request, Response, NextFunction } from 'express';
import Users from '../models/userModel';
import jwt from 'jsonwebtoken';
import { IDecodedToken, IReqAuth } from '../config/interface';

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(400).json({ msg: "Invalid Authentication." });
        // console.log(token);

        const decoded = <IDecodedToken>jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
        // console.log(decoded);
        if (!decoded) return res.status(400).json({ msg: "Invalid Authentication." });

        const user = await Users.findOne({ _id: decoded.id });
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        req.userId = user;
        // req.userId = decoded.id;

        next();

    } catch (error) {
        let errMsg;

        if (error.code === 11000) {
            errMsg = Object.values(error.keyValue)[0] + " already exists.";
        } else {
            let name = Object.keys(error.errors)[0];
            errMsg = error.errors[`${name}`].message;
        }

        return res.status(500).json({ msg: errMsg });
    }
}

export default auth;
