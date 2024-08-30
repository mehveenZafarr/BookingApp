import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateTokenAndSetCookie = (userId, res) => {
    // const secret = crypto.randomBytes(64).toString('hex');
    //JWT_SECRET generated via command : openssl rand -base64 32 - in bash cmd
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn: '15d'},
    );
    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });
    // console.log(res.cookie());
}