import { Request, Response } from "express";
import { HttpResponse } from "../../config/HttpResponse";
import { User } from "../dao/domain/user/User";
import UserService from "../services/user.service";
import { JsonWebToken } from "../../utils/jwt/JsonWebToken";
import { UserError } from "../dao/domain/user/user.error";
import { ProductError } from "../dao/domain/product/product.error";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getUserByEmailToken(req: Request, res: Response) {
    const { email } = req.user as User;
    const user = await this.userService.findByEmail(email);

    if (user) {
      const { firstName, lastName, age, email, _id } = user;
      HttpResponse.Ok(res, { firstName, lastName, age, email, _id });
    } else {
      throw new UserError("User not found");
    }
  }

  public async getUserByToken(req: Request, res: Response) { 
    const { sub } = req.user as JsonWebToken;
    const user = await this.userService.findOne({ _id: sub });

    if (user) {
      const { _id, cart } = user;
      HttpResponse.Ok(res, { _id, cart });
    } else {
      throw new UserError("User not found");
    }
  }

  public async updateUserAddCart(req: Request, res: Response) {
    const {uid, cid} = req.params;
    const user = await this.userService.update(uid, {cart: cid} as User);

    if (user) {
      HttpResponse.Ok(res, {cart: user.cart});
    } else {
      throw new ProductError("Product not found");
    }
  }

  public async updateUserPremium(req: Request, res: Response) {
    const {uid} = req.params;
    const user = await this.userService.findOne({ _id: uid });
    if (user?.role === 'admin') throw new UserError("Unauthorized");
    
    const userUpdate = await this.userService.update(uid, {role: user!.role === 'user'? 'premium':'user'} as User);

    if (userUpdate) {
      HttpResponse.Ok(res, {role: userUpdate.role});
    } else {
      throw new UserError("User not found");
    }
  }
}
