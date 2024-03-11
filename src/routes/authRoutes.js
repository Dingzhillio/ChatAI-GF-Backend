import express from 'express'

import * as authController from '../controllers/authController.js';
// import * as chatController from '../controllers/chatController.js';

const authRoute = express.Router()

authRoute.post('/register', authController.signup);
authRoute.post('/login', authController.login);
authRoute.post('/logout', authController.logout);
authRoute.get('/fetchUser', authController.fetch);
export default authRoute;
