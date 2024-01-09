import jwt from "jsonwebtoken";
import { User } from "../../app/dao/domain/user/User";
import { JsonWebToken } from "./JsonWebToken";

export const generateToken = (user: User) => { 
    return jwt.sign(
        {email: user.email, firstName: user.firstName, role: user.role || null} as JsonWebToken,
        process.env.JWT_SECRET as string, 
        { expiresIn: Number(process.env.EXPIRATION), subject: String(user._id) }
    );
};

export const generateTokenForgotPassword = (user: User) => {
    return jwt.sign(
        {email: user.email, firstName: user.firstName},
        process.env.JWT_SECRET as string,
        { expiresIn: 3600, subject: String(user._id) }
    );
}

export const validateToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string);