import { RouterConfig } from "../../config/RouterConfig";
import { ViewController } from "../controlller/view.controller";
import { authenticationLogin } from "../middlewares/authentication.middleware";

export class ViewRouter extends RouterConfig<ViewController> {
  constructor() {
    super(ViewController, "");
    this.routes();
  }

  public routes(): void {
    // GET ROUTES
    this.router.get('/login', this.controller.viewLogin.bind(this.controller));
    this.router.get('/logout', this.controller.viewLogout.bind(this.controller));
    // MIDDLEWARE AUTHENTICATION
    this.router.get('/', authenticationLogin, this.controller.viewIndex.bind(this.controller));
    this.router.get('/profile', authenticationLogin, this.controller.viewProfile.bind(this.controller));
    this.router.get('/home', authenticationLogin, this.controller.viewProducts.bind(this.controller));
    this.router.get('/realtimeproducts', authenticationLogin, this.controller.viewRealTimeProducts.bind(this.controller));
    this.router.get('/chat', authenticationLogin, this.controller.viewChat.bind(this.controller));
    this.router.get('/products', authenticationLogin, this.controller.viewPaginateProducts.bind(this.controller));
    this.router.get('/carts', authenticationLogin, this.controller.viewCartById.bind(this.controller));
  }

}
