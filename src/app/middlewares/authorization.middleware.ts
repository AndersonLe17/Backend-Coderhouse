import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { HttpResponse } from "../../config/HttpResponse";

export const authorizationAdmin = (req: Request,res: Response,next: NextFunction) => {
  passport.authenticate("current", (err: any, user: Express.User | false | null, info: object | string | Array<string | undefined>, status: number | Array<number | undefined>) => {
    if (err) return next(err);
    if (user === null || user instanceof Boolean) return res.redirect("/logout");

    if ((user as any).role === "user") return HttpResponse.Unauthorized(res, "Unauthorized");
    next();
  })(req, res, next);
};

export const authorizationUser = (req: Request,res: Response,next: NextFunction) => {
  passport.authenticate("current", (err: any, user: Express.User | false | null, info: object | string | Array<string | undefined>, status: number | Array<number | undefined>) => {
    if (err) return next(err);
    if (user === null || user instanceof Boolean) return res.redirect("/logout");

    if ((user as any).role === "admin") return HttpResponse.Unauthorized(res, "Unauthorized");
    next();
  })(req, res, next);
};