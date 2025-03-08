import express from 'express';
import { checkOtp, checkUserEmail, checkUserName, createUser, getCurrentUser, login, sendOtp, updateUser,  } from '../controller/userController.js';
import upload from '../middlewares/uploadMiddleware.js';
import { authenticateUser } from '../middlewares/userMiddleware.js';


const userRouter = express.Router();


userRouter.post('/check-email',checkUserEmail);
userRouter.post('/check-username',checkUserName)
userRouter.post('/send-otp',sendOtp);
userRouter.post('/verify-otp',checkOtp);
userRouter.post('/create-user',createUser);
userRouter.post('/login',login);
userRouter.get('/current-user',authenticateUser,getCurrentUser)
userRouter.post('/profile-update',upload.fields([{ name: "bannerImage" }, { name: "profileImage" }]),updateUser)


export default userRouter