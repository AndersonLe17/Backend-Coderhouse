import { Request, Response } from "express";
import { HttpResponse } from "../../config/HttpResponse";
import { User } from "../dao/domain/user/User";
import UserService from "../services/user.service";
import { JsonWebToken } from "../../utils/jwt/JsonWebToken";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getUserByEmailToken(req: Request, res: Response) {
    try {
      const { email } = req.user as User;
      const user = await this.userService.findByEmail(email);

      if (user) {
        const { firstName, lastName, age, email, _id } = user;
        HttpResponse.Ok(res, { firstName, lastName, age, email, _id });
      } else {
        HttpResponse.NotFound(res, "User not found");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }

  public async getUserByToken(req: Request, res: Response) {
    try {
      const { sub } = req.user as JsonWebToken;
      const user = await this.userService.findOne({ _id: sub });

      if (user) {
        const { _id, cart } = user;
        HttpResponse.Ok(res, { _id, cart });
      } else {
        HttpResponse.NotFound(res, "User not found");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }

  public async updateUserAddCart(req: Request, res: Response) {
    try {
      const {uid, cid} = req.params;
      const user = await this.userService.update(uid, {cart: cid} as User);

      if (user) {
        HttpResponse.Ok(res, {cart: user.cart});
      } else {
        HttpResponse.NotFound(res, "Product not found");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }
}
