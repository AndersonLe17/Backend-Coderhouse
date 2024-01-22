import { PaginateModel, PaginateResult } from "mongoose";
import ServiceConfig from "../../config/ServiceConfig";
import { Product } from "../dao/domain/product/Product";
import { ProductModel } from "../dao/domain/product/product.model";

export class ProductService extends ServiceConfig<Product> {
  constructor() {
    super(ProductModel);
  }

  public async findLimitProducts(limit: number = Number.MAX_VALUE): Promise<Product[]> {
    return await this.entityModel.find().limit(limit).lean();
  }

  public async findCategories(): Promise<string[]> {
    return await this.entityModel.distinct("category");
  }

  public async findProductsPaginate(reqQuery: Record<string, any>): Promise<PaginateResult<Product>> {
    const { limit = 10, page = 1, sort, ...query } = reqQuery;
    return await (this.entityModel as PaginateModel<Product>).paginate(query, {
      limit,
      page,
      sort: ["ASC", "DESC"].includes(sort?.toUpperCase())
        ? { price: sort }
        : undefined,
    });
  }

  public async validateProducts(products: string[]): Promise<boolean | string> {
    const productsFound = await this.entityModel.find({_id: {$in: products}});
    
    return (productsFound.length === products.length)
        ? true 
        : products.filter(p => !productsFound.find((pf: Product) => pf._id?.toString() === p)).join(', ');
  }

  public async updateStock(products: Array<object>): Promise<boolean> {
    const productsIds = products.map((p: any) => p._id);
    const productsQuantities = products.map((p: any) => p.quantity);

    const productsUpdate = await this.entityModel.bulkWrite(
      productsIds.map((id: string, index: number) => ({
        updateOne: {
          filter: { _id: id },
          update: { $inc: { stock: -productsQuantities[index] } },
        },
      }))
    );

    return productsUpdate.modifiedCount === products.length;
  }

  public async deleteTestProducts(): Promise<boolean> {
    const result = await this.entityModel.deleteMany({category: "Test"});

    return result.deletedCount > 0;
  }

}

