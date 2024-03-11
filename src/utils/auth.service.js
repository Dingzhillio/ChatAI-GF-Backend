import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '12h'})
}

export default createToken;