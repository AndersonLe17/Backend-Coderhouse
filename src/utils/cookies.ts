import { Request } from "express";

export const cookieExtractor = (req: Request) => {
    if (req && req.cookies) return req.cookies["tokenJWT"];
    return null;
};