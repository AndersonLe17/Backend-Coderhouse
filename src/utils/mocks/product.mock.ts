import { ProductFaker } from "../faker/product.faker";

export class ProductMock {

    public static generateProductMock(qty: number): ProductFaker[] {
        return new Array(qty).fill(0).map(() => new ProductFaker());
    }

}