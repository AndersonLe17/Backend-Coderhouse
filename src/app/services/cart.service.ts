import ServiceConfig from "../../config/ServiceConfig";
import { Cart } from "../dao/domain/cart/Cart";
import { CartModel } from "../dao/domain/cart/cart.model";

export class CartService extends ServiceConfig<Cart> {
  constructor() {
    super(CartModel, "products.product");
  }

  public async findOneById(cartId: string): Promise<Cart | null> {
    return await this.entityModel.findOne({ _id: cartId }).lean();
  }
}
