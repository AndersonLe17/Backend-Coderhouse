import { Request, Response } from "express";
import { User } from "../dao/domain/user/User";
import { generateToken, generateTokenForgotPassword } from "../../utils/jwt/JWT";
import { HttpResponse, HttpStatus } from "../../config/HttpResponse";
import { UserError } from "../dao/domain/user/user.error";
import UserService from "../services/user.service";
import { transporter } from "../../utils/mail/nodemailer";
import { mailForgotPassword } from "../../utils/mail/purchase.mail";
import { JsonWebToken } from "../../utils/jwt/JsonWebToken";
import { createHash, isValidPassword } from "../../utils/bcrypt";

export class SessionController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async loginUserPassport(req: Request, res: Response){
    if (req.user) {
      const user = req.user as User;
      const token = generateToken(user);
      await this.userService.update(user._id!, { lastConnection: new Date() } as User);

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
      const lastConnection = new Date();
      await this.userService.update(user._id!, { lastConnection } as User);

      res.status(HttpStatus.OK).cookie('tokenJWT', token, {httpOnly: true}).redirect('/home');
    } else {
      throw new UserError("Invalid email or password.");
    }
  }

  public async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const user = await this.userService.findByEmail(email);
    
    if (user) {
      const token  = generateTokenForgotPassword(user);
      const url = `${req.protocol}://${req.get("host")}/resetpassword/${token}`;
      transporter.sendMail(mailForgotPassword(email, url));
      await this.userService.update(user._id!, { isforgottenPassword: true } as User);
      HttpResponse.Ok(res, "Email sent");
    } else {
      throw new UserError("User not found");
    }
  }

  public async resetPassword(req: Request, res: Response) {
    const { password } = req.body;
    const { sub } = req.user as JsonWebToken;
    const user = await this.userService.findOne({ _id: sub });

    if (!user) throw new UserError("User not found");
    if (isValidPassword(user.password, password)) throw new UserError("Password can't be the same as the old one");
  
    await this.userService.update(sub, { password: createHash(password), isforgottenPassword: false } as User);
    HttpResponse.Ok(res.clearCookie('tokenJWT'), "Password updated");
  }

}
