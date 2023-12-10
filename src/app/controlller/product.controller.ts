import { Request, Response } from 'express';
import { ProductService } from "../services/product.service";
import { HttpResponse } from '../../config/HttpResponse';
import { Product } from '../dao/domain/product/Product';

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public async getProductsPaginate(req: Request, res: Response) {
    try {       
      const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);    
      const {docs, totalPages, totalDocs, prevPage, nextPage, page, hasPrevPage, hasNextPage} = await this.productService.findProductsPaginate(req.query);
      
      url.searchParams.set("page", String(prevPage));
      const prevLink = String(url);
      url.searchParams.set("page", String(nextPage));
      const nextLink = String(url);
      
      HttpResponse.Ok(res, { payload: docs, totalDocs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink: hasPrevPage ? prevLink : null, nextLink: hasNextPage ? nextLink : null });
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  };

  public async getProducts(_req: Request, res: Response) {
    try {
      const products = await this.productService.findAll();

      HttpResponse.Ok(res, products);
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }
  
  public async getProductById(req: Request, res: Response) {
    try {
      const pid = req.params.pid;
      const product = await this.productService.findById(pid);
  
      if (product) {
        HttpResponse.Ok(res, product);
      } else {
        HttpResponse.NotFound(res, "Product not found");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  };
  
  public async createProduct(req: Request, res: Response) {
    try {
      const product: Product = req.body;
      const newProduct = await this.productService.create(product);
      
      req.app.get("io").emit("ioProduct", { action: "Add", payload: newProduct });
      HttpResponse.Created(res, newProduct);
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  };
  
  public async deleteProduct(req: Request, res: Response) {
    try {
      const pid = req.params.pid;
      const result = await this.productService.delete(pid);
  
      if (result === 1) {
        req.app.get("io").emit("ioProduct", { action: "Delete", payload: pid });
        HttpResponse.Ok(res, "Product deleted");
      } else {
        HttpResponse.NotFound(res, "Product not found");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  };
  
  public async updateProduct(req: Request, res: Response) {
    try {
      const pid = req.params.pid;
      const product = await this.productService.update(pid, req.body as Product);
  
      if (product) {
        req.app.get("io").emit("ioProduct", { action: "Update", payload: product });
        HttpResponse.Ok(res, product);
      } else {
        HttpResponse.NotFound(res, "Product not found");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  };

  public async getCategories(_req: Request, res: Response) {
    try {
      const categories = await this.productService.findCategories();
      HttpResponse.Ok(res, categories);
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }

}
