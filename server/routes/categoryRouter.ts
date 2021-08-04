import express from 'express';
import auth from '../middlewares/auth';
import { createCategory, deleteCategory, getCategory, updateCatagory } from '../controllers/categoryCtrl';

const router = express.Router();

router.route('/category')
    .get(getCategory)
    .post(auth, createCategory);
router.route('/category/:id')
    .patch(auth, updateCatagory)
    .delete(auth, deleteCategory);

export default router;