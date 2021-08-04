import express from 'express';
import { register, activeAccount, login, logout, refreshToken, googleLogin, loginSms, Smsverify } from '../controllers/authCtrl';
import { validRegisters } from '../middlewares/vaild';

const router = express.Router();

router.post('/register', validRegisters, register);
router.post('/active', activeAccount);
router.post('/login', login);
router.get('/logout', logout);
router.get('/refresh_token', refreshToken)
router.post('/google_login', googleLogin);
router.post('/login_sms', loginSms);
router.post('/sms_verify', Smsverify);



export default router;