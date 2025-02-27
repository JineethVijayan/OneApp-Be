import express from 'express';
import { checkOtp, checkUserEmail, checkUserName, createUser, login, sendOtp,  } from '../controller/userController.js';


const userRouter = express.Router();


userRouter.post('/check-email',checkUserEmail);
userRouter.post('/check-username',checkUserName)
userRouter.post('/send-otp',sendOtp);
userRouter.post('/verify-otp',checkOtp);
userRouter.post('/create-user',createUser);
userRouter.post('/login',login);



export default userRouter