import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const authenticationLogin = (req: Request,res: Response,next: NextFunction) => {
  passport.authenticate("current", (err: any, user: Express.User | false | null, _info: object | string | Array<string | undefined>, _status: number | Array<number | undefined>) => {
    if (err) return next(err);
    if (user === null || user === false) return res.redirect("/logout");
    req.user = user;
    
    next();
  })(req, res, next);
};

export const authenticationLogout = (req: Request,res: Response,next: NextFunction) => {
  passport.authenticate("current", (err: any, user: Express.User | false | null, _info: object | string | Array<string | undefined>, _status: number | Array<number | undefined>) => {
    if (err) return next(err);
    if (user === null || user === false) return next();
    req.user = user;
    
    next();
  })(req, res, next);
};