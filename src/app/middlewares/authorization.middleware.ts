import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { HttpResponse } from "../../config/HttpResponse";

export const authorizationAdmin = (req: Request,res: Response,next: NextFunction) => {
  passport.authenticate("current", (err: any, user: Express.User | false | null, _info: object | string | Array<string | undefined>, _status: number | Array<number | undefined>) => {
    if (err) return next(err);
    if (user === null || user === false) return res.redirect("/logout");

    if ((user as any).role !== "admin") return HttpResponse.Unauthorized(res, "Unauthorized");
    req.user = user;
    next();
  })(req, res, next);
};

export const authorizationUser = (req: Request,res: Response,next: NextFunction) => {
  passport.authenticate("current", (err: any, user: Express.User | false | null, _info: object | string | Array<string | undefined>, _status: number | Array<number | undefined>) => {
    if (err) return next(err);
    if (user === null || user === false) return res.redirect("/logout");

    if ((user as any).role !== "user") return HttpResponse.Unauthorized(res, "Unauthorized");
    req.user = user;
    next();
  })(req, res, next);
};