import { Request, Response } from 'express';
import { ProductService } from "../services/product.service";
import { HttpResponse } from '../../config/HttpResponse';
import { Product } from '../dao/domain/product/Product';
import { ProductError } from '../dao/domain/product/product.error';
import { JsonWebToken } from '../../utils/jwt/JsonWebToken';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../utils/firebase/FirebaseConfig";
import { FirebaseStorage, getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

export class ProductController {
  private readonly productService: ProductService;
  private readonly storage: FirebaseStorage;

  constructor() {
    this.productService = new ProductService();
    initializeApp(firebaseConfig);
    this.storage = getStorage();
  }

  public async getProductsPaginate(req: Request, res: Response) {
    const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
    const {docs, totalPages, totalDocs, prevPage, nextPage, page, hasPrevPage, hasNextPage} = await this.productService.findProductsPaginate(req.query);
    
    url.searchParams.set("page", String(prevPage));
    const prevLink = String(url);
    url.searchParams.set("page", String(nextPage));
    const nextLink = String(url);
    
    HttpResponse.Ok(res, { data: docs, totalDocs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink: hasPrevPage ? prevLink : null, nextLink: hasNextPage ? nextLink : null });
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
    const file = req.file;
    const { sub } = req.user as JsonWebToken;
    product.owner = sub;
    
    const newProduct = await this.productService.create(product);
    if (file) {
      const typeDocument = file?.mimetype.split('/')[1];
      if (typeDocument !== 'jpeg' && typeDocument !== 'png') throw new Error("Invalid file type");
      
      const storageRef = ref(this.storage, `products/thumbnail_${newProduct._id}`);
      const snapshot = await uploadBytesResumable(storageRef, file?.buffer!, { contentType: file?.mimetype });
      const downloadURL = await getDownloadURL(snapshot.ref);

      const updateProduct = await this.productService.update(newProduct._id!, {thumbnail: downloadURL} as Product);
      newProduct.thumbnail = updateProduct?.thumbnail!;
    }

    req.app.get("io").emit("ioProduct", { action: "Add", payload: newProduct });
    HttpResponse.Created(res, newProduct);
  }

  public async updateProduct(req: Request, res: Response) {
    const product: Product = req.body;
    const pid = req.params.pid;
    const file = req.file;
    const { sub, role } = req.user as JsonWebToken;
    const findProduct = await this.productService.findOne({_id: pid});

    if (role === 'admin' || (findProduct?.owner)?.toString() === sub) {
      if (file) {
        const typeDocument = file?.mimetype.split('/')[1];
        if (typeDocument !== 'jpeg' && typeDocument !== 'png') throw new Error("Invalid file type");
        
        const storageRef = ref(this.storage, `products/thumbnail_${pid}`);
        const snapshot = await uploadBytesResumable(storageRef, file?.buffer!, { contentType: file?.mimetype });
        const downloadURL = await getDownloadURL(snapshot.ref);

        product.thumbnail = downloadURL;
      }

      const updateProduct = await this.productService.update(pid, product);

      if (updateProduct) {
        req.app.get("io").emit("ioProduct", { action: "Update", payload: updateProduct });
        HttpResponse.Ok(res, updateProduct);
      } else {
        throw new ProductError("Product not found");
      }
    } else if (!findProduct) {
      throw new ProductError("Product not found");
    } else {
      throw new ProductError("You are not authorized to update this product");
    }
  }
  
  public async deleteProduct(req: Request, res: Response) {
    const pid = req.params.pid;
    const { sub, role } = req.user as JsonWebToken;
    const product = await this.productService.findOne({_id: pid});
    
    if (role === 'admin' || (product?.owner)?.toString() === sub) {
      const result = await this.productService.delete(pid);

      if (result === 1) {
        if (product?.thumbnail !== "No image") {
          const storageRef = ref(this.storage, `products/thumbnail_${pid}`);
          deleteObject(storageRef);
        }
        req.app.get("io").emit("ioProduct", { action: "Delete", payload: pid });
        HttpResponse.Ok(res, "Product deleted");
      } else {
        throw new ProductError("Product not found");
      }
    } else if (!product){
      throw new ProductError("Product not found");
    } else {
      throw new ProductError("You are not authorized to delete this product");
    }
  }

  public async deleteTestProducts(_req: Request, res: Response) {
    const result = await this.productService.deleteTestProducts();
    HttpResponse.Ok(res, result? "Test products deleted" : "Test products not found");
  }

  public async getCategories(_req: Request, res: Response) {
    const categories = await this.productService.findCategories();
    HttpResponse.Ok(res, categories);
  }

}
