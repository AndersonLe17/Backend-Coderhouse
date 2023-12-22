import { Request, Response } from "express";
import { User } from "../dao/domain/user/User";
import { generateToken } from "../../utils/jwt/JWT";
import { HttpResponse, HttpStatus } from "../../config/HttpResponse";
import { UserError } from "../dao/domain/user/user.error";


export class SessionController {

  public async loginUserPassport(req: Request, res: Response){
    if (req.user) {
      const user = req.user as User;
      const token = generateToken(user);
      
      res.status(HttpStatus.OK).cookie('tokenJWT', token, {httpOnly: true}).json({ code: HttpStatus.OK, status: "OK", message: "Logged in", token });
    } else {
      throw new UserError("Invalid email or password.");
      // HttpResponse.NotFound(res, "Invalid email or password.");
    }
  }

  public async registerUserPassport(req: Request, res: Response) {
    const user = req.user as User;
    // req.session!.user = user;
    const token = generateToken(user);
    HttpResponse.Created(res, {token});
  }

  public async loginGitHubPassport(req: Request, res: Response) {
    if (req.user) {
      const user = req.user as User;
      const token = generateToken(user);

      res.status(HttpStatus.OK).cookie('tokenJWT', token, {httpOnly: true}).redirect('/home');
    } else {
      throw new UserError("Invalid email or password.");
      // HttpResponse.NotFound(res, "Invalid email or password.");
    }
  }

}
