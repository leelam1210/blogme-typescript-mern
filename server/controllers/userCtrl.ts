import { Response } from 'express';
import { IReqAuth } from '../config/interface';
import Users from '../models/userModel';
import bcrypt from "bcrypt";

export const updateUsers = async (req: IReqAuth, res: Response) => {
    if (!req.userId) return res.status(400).json({ msg: "Invalid Authentication." });

    try {
        const { avatar, name } = req.body;
        const updatedUser = { avatar: avatar, name: name };

        await Users.findOneAndUpdate({ _id: req.userId._id }, updatedUser, { new: true });

        res.json({ msg: "Update Success!" });
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
}

export const resetPassword = async (req: IReqAuth, res: Response) => {
    if (!req.userId) return res.status(400).json({ msg: "Invalid Authentication." });

    if (req.userId.type !== 'register')
        return res.status(400).json({
            msg: `Quick login account with ${req.userId.type} can't use this function.`
        });

    try {
        const { password } = req.body;

        const passwordHash = await bcrypt.hash(password, 12);

        await Users.findOneAndUpdate({ _id: req.userId._id }, { password: passwordHash }, { new: true });

        res.json({ msg: "Reset Password Success!" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}