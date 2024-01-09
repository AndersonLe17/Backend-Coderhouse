import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { JsonWebToken } from "../../utils/jwt/JsonWebToken";
import { logger } from "../../utils/logger/winston";
import UserService from "../services/user.service";

export class ViewController {
  private readonly productService: ProductService;
  private readonly userService: UserService;

  constructor() {
    this.productService = new ProductService();
    this.userService = new UserService();
  }

  public async viewIndex(_req: Request, res: Response) {    
    res.render('index');
  };

  public async viewProfile(_req: Request, res: Response) {
    res.render('profile', {title: 'Profile'});
  };

  public async viewProducts(req: Request, res: Response) {
    const products = await this.productService.findAll();
    const token = req.user as JsonWebToken;
    
    res.render('home', {title: 'Products', products, name: `${token.firstName}`});
  }

  public async viewRealTimeProducts(_req: Request, res: Response) {
    const products = await this.productService.findAll();
    res.render('realTimeProducts', {title: 'Products', products});
  }

  public async viewChat(_req: Request, res: Response) {
    res.render('chat', {title: 'Chat'});
  }

  public async viewPaginateProducts(_req: Request, res: Response) {
    res.render('products', {title: 'Paginate Products'});
  }

  public async viewCartById(_req: Request, res: Response) {
    res.render('carts', {title: 'Paginate Products'});
  }

  public async viewLogin(req: Request, res: Response) {
    if (!req.cookies.tokenJWT) {
      res.render('login', {title: 'Login', isLogout: true});
    } else {
      res.redirect('/');
    }
  }

  public async viewLogout(req: Request, res: Response) {
    req.logout((_error) => {
      res.clearCookie('tokenJWT').redirect('/login');
    });
  }

  public async viewForgotPassword(_req: Request, res: Response) {
    res.render('forgotPassword', {title: 'Forgot Password', isLogout: true});
  }

  public async viewResetPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { sub } = req.user as JsonWebToken;
    const user = await this.userService.findOne({ _id: sub });
    if (user?.isforgottenPassword === false) return res.redirect('/login');
    res.status(200).cookie('tokenJWT', token, {httpOnly: true}).render('resetPassword', {title: 'Reset Password', isLogout: true});
  }

  public async testLogger(_req: Request, res: Response) {
    logger.debug('Debugging test');
    logger.http('Http test');
    logger.info('Info test');
    logger.warning('Warning test');
    logger.error('Error test');
    logger.fatal('Fatal test');
    res.send('Logger test');
  }
}
