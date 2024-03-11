import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/usersModel.js';

const checkAuth = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith('Bearer')) {
        try{

            token = authHeader.split(' ')[1];

            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decode.id).select('-password');

            next();

        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, invalid token')
        }
    }

    if(!token) {
        res.status(401);
        throw new Error('Not authorized, no token found')
    }
})

export {checkAuth}