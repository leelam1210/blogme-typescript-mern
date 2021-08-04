import { Request, Response } from 'express';
import Categories from '../models/categoryModel';
import { IReqAuth } from '../config/interface';


export const createCategory = async (req: IReqAuth, res: Response) => {
    if (!req.userId) return res.status(400).json({ msg: "Invalid Authentication." });
    if (req.userId.role !== 'admin')
        return res.status(400).json({ msg: "Invalid Authentication." });
    try {
        const name = req.body.name.toLowerCase();

        console.log(name);

        const newCategory = new Categories({ name });
        await newCategory.save();

        res.json({ newCategory });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export const getCategory = async (req: Request, res: Response) => {
    try {
        const categories = await Categories.find().sort("-createdAt");
        res.json({ categories });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const updateCatagory = async (req: IReqAuth, res: Response) => {
    if (!req.userId) return res.status(400).json({ msg: "Invalid Authentication." });

    if (req.userId.role !== 'admin')
        return res.status(400).json({ msg: "Invalid Authentication." });


    try {
        const name = req.body.name;
        const id = req.params.id;
        const category = await Categories.findOneAndUpdate({ _id: id }, { name: name }, { new: true });

        res.json({ msg: "Update Success!" });
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
};

export const deleteCategory = async (req: IReqAuth, res: Response) => {
    if (!req.userId) return res.status(400).json({ msg: "Invalid Authentication." });

    if (req.userId.role !== 'admin')
        return res.status(400).json({ msg: "Invalid Authentication." });

    try {
        const category = await Categories.findByIdAndDelete(req.params.id);

        res.json({ msg: "Delete Success!" });
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
}