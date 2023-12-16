import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../../config/HttpResponse";

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  HttpResponse.Error(res, err);
};
