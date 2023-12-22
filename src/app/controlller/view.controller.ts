import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { JsonWebToken } from "../../utils/jwt/JsonWebToken";

export class ViewController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
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
}
