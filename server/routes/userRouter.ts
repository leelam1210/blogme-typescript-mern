import express from 'express';
import auth from '../middlewares/auth';
import { updateUsers, resetPassword } from '../controllers/userCtrl';

const router = express.Router();

router.patch('/user', auth, updateUsers);
router.patch('/reset_password', auth, resetPassword);


export default router;