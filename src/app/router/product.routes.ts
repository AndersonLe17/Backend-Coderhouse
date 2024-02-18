import { RouterConfig } from "../../config/RouterConfig";
import { ProductController } from "../controlller/product.controller";
import { authorizationProduct } from "../middlewares/authorization.middleware";
import { upload } from "../middlewares/multer.middleware";

export class ProductRouter extends RouterConfig<ProductController> {
  constructor() {
    super(ProductController, "/api/products");
    this.routes();
  }

  public routes(): void {
    // GET ROUTES
    this.router.get('/', this.controller.getProductsPaginate.bind(this.controller));
    this.router.get('/:pid', this.controller.getProductById.bind(this.controller));
    this.router.get('/categories/all', this.controller.getCategories.bind(this.controller));
    // POST ROUTES
    this.router.post('/', authorizationProduct, upload.single('thumbnail'), this.controller.createProduct.bind(this.controller));
    // PUT ROUTES
    this.router.put('/:pid', authorizationProduct, upload.single('thumbnail'), this.controller.updateProduct.bind(this.controller));
    // DELETE ROUTES
    this.router.delete('/:pid', authorizationProduct, this.controller.deleteProduct.bind(this.controller));
    this.router.delete('/delete/test', this.controller.deleteTestProducts.bind(this.controller));
  }
}
