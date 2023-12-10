import passport from "passport";
import { RouterConfig } from "../../config/RouterConfig";
import { UserController } from "../controlller/user.controller";

export class UserRouter extends RouterConfig<UserController> {

  constructor() {
    super(UserController, "/api/users");
    this.routes();
  }

  public routes(): void {
    // GET ROUTES

    // POST ROUTES

    // PUT ROUTES

    // DELETE ROUTES
    
    // MIDDLEWARE AUTH
    this.router.use(passport.authenticate('current', {session: false, failureRedirect: '/logout'}));
    this.router.get("/profile",this.controller.getUserByEmailToken.bind(this.controller));
    this.router.get("/cart", this.controller.getUserByToken.bind(this.controller));
    this.router.put("/:uid/cart/:cid", this.controller.updateUserAddCart.bind(this.controller));
  }
}
