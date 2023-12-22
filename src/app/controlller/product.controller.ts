import { Request, Response } from 'express';
import { ProductService } from "../services/product.service";
import { HttpResponse } from '../../config/HttpResponse';
import { Product } from '../dao/domain/product/Product';
import { ProductError } from '../dao/domain/product/product.error';

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public async getProductsPaginate(req: Request, res: Response) {
    const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);    
    const {docs, totalPages, totalDocs, prevPage, nextPage, page, hasPrevPage, hasNextPage} = await this.productService.findProductsPaginate(req.query);
    
    url.searchParams.set("page", String(prevPage));
    const prevLink = String(url);
    url.searchParams.set("page", String(nextPage));
    const nextLink = String(url);
    
    HttpResponse.Ok(res, { payload: docs, totalDocs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink: hasPrevPage ? prevLink : null, nextLink: hasNextPage ? nextLink : null });
  }

  public async getProducts(_req: Request, res: Response) {
    const products = await this.productService.findAll();
    HttpResponse.Ok(res, products);
  }
  
  public async getProductById(req: Request, res: Response) {
    const pid = req.params.pid;
    const product = await this.productService.findById(pid);

    if (product) {
      HttpResponse.Ok(res, product);
    } else {
      throw new ProductError("Product not found");
      // HttpResponse.NotFound(res, "Product not found");
    }
  }
  
  public async createProduct(req: Request, res: Response) {
    const product: Product = req.body;
    const newProduct = await this.productService.create(product);
    
    req.app.get("io").emit("ioProduct", { action: "Add", payload: newProduct });
    HttpResponse.Created(res, newProduct);
  }
  
  public async deleteProduct(req: Request, res: Response) {
    const pid = req.params.pid;
    const result = await this.productService.delete(pid);

    if (result === 1) {
      req.app.get("io").emit("ioProduct", { action: "Delete", payload: pid });
      HttpResponse.Ok(res, "Product deleted");
    } else {
      throw new ProductError("Product not found");
      // HttpResponse.NotFound(res, "Product not found");
    }
  }
  
  public async updateProduct(req: Request, res: Response) {
    const pid = req.params.pid;
    const product = await this.productService.update(pid, req.body as Product);

    if (product) {
      req.app.get("io").emit("ioProduct", { action: "Update", payload: product });
      HttpResponse.Ok(res, product);
    } else {
      throw new ProductError("Product not found");
      // HttpResponse.NotFound(res, "Product not found");
    }
  }

  public async getCategories(_req: Request, res: Response) {
    const categories = await this.productService.findCategories();
    HttpResponse.Ok(res, categories);
  }

}
