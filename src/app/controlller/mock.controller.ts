import { Request, Response } from "express";
import { HttpResponse } from "../../config/HttpResponse";
import { ProductMock } from "../../test/mocks/product.mock";

export class MockController {

  public async getProductsMock(_req: Request, res: Response) {
    const mocks = ProductMock.generateProductMock(100);
    HttpResponse.Ok(res, mocks);
  }
  
}
