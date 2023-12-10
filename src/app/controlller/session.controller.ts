import { Request, Response } from "express";
import { User } from "../dao/domain/user/User";
import { generateToken } from "../../utils/jwt/JWT";
import { HttpResponse, HttpStatus } from "../../config/HttpResponse";


export class SessionController {

  public async loginUserPassport(req: Request, res: Response){
    try {
      if (req.user) {
        const user = req.user as User;
        const token = generateToken(user);
        
        res.status(HttpStatus.OK).cookie('tokenJWT', token, {httpOnly: true}).json({ code: HttpStatus.OK, status: "OK", message: "Logged in", token });
      } else {
        HttpResponse.NotFound(res, "Invalid email or password.");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }

  public async registerUserPassport(req: Request, res: Response) {
    try {
      const user = req.user as User;
      // req.session!.user = user;
      const token = generateToken(user);

      HttpResponse.Created(res, {token});
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }

  public async loginGitHubPassport(req: Request, res: Response) {
    try {
      if (req.user) {
        const user = req.user as User;
        const token = generateToken(user);

        res.status(HttpStatus.OK).cookie('tokenJWT', token, {httpOnly: true}).redirect('/home');
      } else {
        HttpResponse.NotFound(res, "Invalid email or password.");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }

}
