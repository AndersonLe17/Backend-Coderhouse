import passport from "passport";
import { RouterConfig } from "../../config/RouterConfig";
import { ViewController } from "../controlller/view.controller";

export class ViewRouter extends RouterConfig<ViewController> {
  constructor() {
    super(ViewController, "");
    this.routes();
  }

  public routes(): void {
    // GET ROUTES
    this.router.get('/login', this.controller.viewLogin.bind(this.controller));
    this.router.get('/logout', this.controller.viewLogout.bind(this.controller));
    // MIDDLEWARE AUTH
    this.router.use(passport.authenticate('current', {session: false, failureRedirect: '/logout'}));

    this.router.get('/', this.controller.viewIndex.bind(this.controller));
    this.router.get('/profile', this.controller.viewProfile.bind(this.controller));
    this.router.get('/home', this.controller.viewProducts.bind(this.controller));
    this.router.get('/realtimeproducts', this.controller.viewRealTimeProducts.bind(this.controller));
    this.router.get('/chat', this.controller.viewChat.bind(this.controller));
    this.router.get('/products', this.controller.viewPaginateProducts.bind(this.controller));
    this.router.get('/carts', this.controller.viewCartById.bind(this.controller));
  }

}
