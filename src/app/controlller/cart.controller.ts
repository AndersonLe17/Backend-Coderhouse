import { HttpResponse } from "../../config/HttpResponse";
import { Cart, CartProduct } from "../dao/domain/cart/Cart";
import { CartService } from "../services/cart.service";
import { ProductService } from "../services/product.service";
import { Request, Response } from "express";
import UserService from "../services/user.service";
import TicketService from "../services/tickec.service";
import { Ticket } from "../dao/domain/ticket/Ticket";
import { transporter } from "../../utils/mail/nodemailer";
import { mailTicket } from "../../utils/mail/purchase.mail";
import { CartError } from "../dao/domain/cart/cart.error";
import { ProductError } from "../dao/domain/product/product.error";
import { UserError } from "../dao/domain/user/user.error";
import { JsonWebToken } from "../../utils/jwt/JsonWebToken";

export class CartController {
    private readonly cartService: CartService;
    private readonly productService: ProductService;
    private readonly userService: UserService;
    private readonly ticketService: TicketService;
  
    constructor() {
      this.cartService = new CartService();
      this.productService = new ProductService();
      this.userService = new UserService();
      this.ticketService = new TicketService();
    }

    public async createCart(_req: Request, res: Response) {
      const newCart = await this.cartService.create({} as Cart);
      HttpResponse.Created(res, newCart);
    }
    
    public async getCartById(req: Request, res: Response) {
      const cid = req.params.cid;
      const cart = await this.cartService.findById(cid);
  
      if (cart) {
        HttpResponse.Ok(res, cart);
      } else {
        throw new CartError("Cart not found");
      }
    }
    
    public async addProductToCart(req: Request, res: Response) {
      const {cid, pid} = req.params;
      const {sub,role} = req.user as JsonWebToken;
      const cart = await this.cartService.findOneById(cid);
      const product = await this.productService.findById(pid);
      const newCartItems: Map<string, CartProduct> = new Map();
      
      if (role === "premium" && (product?.owner)?.toString() === sub) throw new ProductError("Unauthorized");
      
      if (cart && product) { // TODO: Validar stock del producto
        cart.products.push({product: pid, quantity: 1});

        cart.products.forEach(p => newCartItems.get(p.product.toString())
          ? newCartItems.get(p.product.toString())!.quantity += p.quantity 
          : newCartItems.set(p.product.toString(), {product: p.product, quantity: p.quantity})
        );
        
        cart.products = Array.from(newCartItems.values());
        const updatedCart = await this.cartService.update(cid, cart); // TODO: Restar stock del producto

        HttpResponse.Ok(res, updatedCart);
      } else {
        if (!cart) throw new CartError("Cart not found");
        if (!product) throw new ProductError("Product not found");
        // HttpResponse.NotFound(res, cart ? "Product" : "Cart" + " not found");
      }
    }
  
    public async deleteProductToCart(req: Request, res: Response) {
      const {cid, pid} = req.params;
      const cart = await this.cartService.findOneById(cid);
      const product = await this.productService.findById(pid);

      if (cart && product) {
        const existProductInCart = cart.products.find(p => p.product.toString() === pid);

        if (existProductInCart) {
          cart.products = cart.products.filter(p => p.product.toString() !== pid);
          const updatedCart = await this.cartService.update(cid, cart); // TODO: Sumar stock del producto

          HttpResponse.Ok(res, updatedCart);
        } else {
          throw new CartError("Product not found in cart");
          // HttpResponse.Ok(res, "Product not found in cart");
        }
      } else {
        if (!cart) throw new CartError("Cart not found");
        if (!product) throw new ProductError("Product not found");
        // HttpResponse.NotFound(res, cart ? "Product" : "Cart" + " not found");
      }
    }
  
    public async updateCart(req: Request, res: Response) {
      const {cid} = req.params;
      const products: CartProduct[] = req.body.products;
      const cart = await this.cartService.findOneById(cid);
      const validProducts = await this.productService.validateProducts(products.map(p => p.product));
      const newCartItems: Map<string, CartProduct> = new Map();

      if (cart && (validProducts === true)) {
        cart.products.push(...products);
        cart.products.forEach(p => newCartItems.get(p.product.toString())
          ? newCartItems.get(p.product.toString())!.quantity += p.quantity 
          : newCartItems.set(p.product.toString(), {product: p.product, quantity: p.quantity})
        );
        cart.products = Array.from(newCartItems.values());
        const updatedCart = await this.cartService.update(cid, cart);

        HttpResponse.Ok(res, updatedCart);
      } else if (validProducts !== true) {
        throw new ProductError(`Product ${validProducts} not found`);
        // HttpResponse.NotFound(res, "Product " + validProducts + " not found");
      } else {
        throw new CartError("Cart not found");
        // HttpResponse.NotFound(res, "Cart not found");
      }
    }
  
    public async updateProductToCart(req: Request, res: Response) {
      const {cid, pid} = req.params;
      const quantity: number = req.body.quantity;
      const cart = await this.cartService.findOneById(cid);
      const product = await this.productService.findById(pid);

      if (cart && product) {
        const existProductInCart = cart.products.find(p => p.product.toString() === pid);
        
        if (existProductInCart) {
          cart.products = cart.products.map(p => p.product.toString() === pid ? {product: pid, quantity: quantity} : p);
          const updatedCart = await this.cartService.update(cid, cart); // TODO: Actualizar stock del producto

          HttpResponse.Ok(res, updatedCart);
        } else {
          throw new CartError("Product not found in cart");
          // HttpResponse.Ok(res, "Product not found in cart");
        }
      } else {
        if (!cart) throw new CartError("Cart not found");
        if (!product) throw new ProductError("Product not found");
        // HttpResponse.NotFound(res, cart ? "Product" : "Cart" + " not found");
      }
    }
  
    public async deleteCart(req: Request, res: Response) {
      const {cid} = req.params;
      const cart = await this.cartService.findOneById(cid);

      if (cart) {
        cart.products = [];
        const updatedCart = await this.cartService.update(cid, cart); // TODO: Actualizar stock de los productos

        HttpResponse.Ok(res, updatedCart);
      } else {
        throw new CartError("Cart not found");
        // HttpResponse.NotFound(res, "Cart not found");
      }
    }

    public async purchaseCart(req: Request, res: Response) {
      const { cid } = req.params;
      const { uid } = req.body;
      const cart = await this.cartService.findById(cid);
      const user = await this.userService.findOneById(uid);
      if (!cart || !user) {
        if (!cart) throw new CartError("Cart not found");
        if (!user) throw new UserError("User not found");
        // HttpResponse.NotFound(res, cart ? "User" : "Cart" + " not found")
      }

      const productsFilter = cart.products.filter((p) => p.quantity <= (p.product as any).stock);
      const amount = productsFilter.reduce((acc, p) => acc + (p.quantity * (p.product as any).price), 0);

      const updatedStock = await this.productService.updateStock(productsFilter.map((p) => ({ _id: (p.product as any)._id, quantity: p.quantity })));

      if (updatedStock) {
        const ticket = await this.ticketService.create({amount: Number(amount.toFixed(2)), purchaser: user.email } as Ticket);
        const cartFilter = cart.products.filter((p) => p.quantity > (p.product as any).stock).map(p => ({product: (p.product as any)._id, quantity: p.quantity}));
        const updatedCart = await this.cartService.update(cid, { products: cartFilter } as Cart);
        
        const response = (cartFilter.length > 0)? updatedCart : ticket;

        transporter.sendMail(mailTicket(ticket));
        HttpResponse.Ok(res, response);
      } else {
        throw new ProductError("Error updating stock");
        // HttpResponse.InternalServerError(res, "Error updating stock");
      }
    }
}