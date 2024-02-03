import { RouterConfig } from "../../config/RouterConfig";
import { ViewController } from "../controlller/view.controller";
import { authenticationLogin, authenticationLogout } from "../middlewares/authentication.middleware";
import { expirationReset } from "../middlewares/authorization.middleware";

export class ViewRouter extends RouterConfig<ViewController> {
  constructor() {
    super(ViewController, "");
    this.routes();
  }

  public routes(): void {
    // GET ROUTES
    this.router.get('/login', this.controller.viewLogin.bind(this.controller));
    this.router.get('/logout', authenticationLogout, this.controller.viewLogout.bind(this.controller));
    this.router.get('/forgotpassword', this.controller.viewForgotPassword.bind(this.controller));
    this.router.get('/resetpassword/:token', expirationReset, this.controller.viewResetPassword.bind(this.controller));
    // MIDDLEWARE AUTHENTICATION
    this.router.get('/', authenticationLogin, this.controller.viewIndex.bind(this.controller));
    this.router.get('/profile', authenticationLogin, this.controller.viewProfile.bind(this.controller));
    this.router.get('/home', authenticationLogin, this.controller.viewProducts.bind(this.controller));
    this.router.get('/realtimeproducts', authenticationLogin, this.controller.viewRealTimeProducts.bind(this.controller));
    this.router.get('/chat', authenticationLogin, this.controller.viewChat.bind(this.controller));
    this.router.get('/products', authenticationLogin, this.controller.viewPaginateProducts.bind(this.controller));
    this.router.get('/carts', authenticationLogin, this.controller.viewCartById.bind(this.controller));
    this.router.get('/loggerTest', this.controller.testLogger.bind(this.controller));
  }

}
