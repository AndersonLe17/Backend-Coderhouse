import { RouterConfig } from "../../config/RouterConfig";
import { CartController } from "../controlller/cart.controller";
import { authorizationUser } from "../middlewares/authorization.middleware";

export class CartRouter extends RouterConfig<CartController> {
  constructor() {
    super(CartController, "/api/carts");
    this.routes();
  }

  public routes(): void {
    // GET ROUTES
    this.router.get('/:cid', authorizationUser, this.controller.getCartById.bind(this.controller));
    // POST ROUTES
    this.router.post('/', authorizationUser, this.controller.createCart.bind(this.controller));
    this.router.post('/:cid/product/:pid', authorizationUser, this.controller.addProductToCart.bind(this.controller));
    this.router.post('/:cid/purchase', authorizationUser, this.controller.purchaseCart.bind(this.controller));
    // PUT ROUTES
    this.router.put('/:cid', authorizationUser, this.controller.updateCart.bind(this.controller));
    this.router.put('/:cid/products/:pid', authorizationUser, this.controller.updateProductToCart.bind(this.controller));
    // DELETE ROUTES
    this.router.delete('/:cid/products/:pid', authorizationUser, this.controller.deleteProductToCart.bind(this.controller));
    this.router.delete('/:cid', authorizationUser, this.controller.deleteCart.bind(this.controller));
  }
}
