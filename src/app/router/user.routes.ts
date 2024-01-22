import { RouterConfig } from "../../config/RouterConfig";
import { UserController } from "../controlller/user.controller";
import { authenticationLogin } from "../middlewares/authentication.middleware";

export class UserRouter extends RouterConfig<UserController> {

  constructor() {
    super(UserController, "/api/users");
    this.routes();
  }

  public routes(): void {
    this.router.get("/profile", authenticationLogin, this.controller.getUserByEmailToken.bind(this.controller));
    this.router.get("/cart", authenticationLogin, this.controller.getUserByToken.bind(this.controller));
    this.router.put("/premium/:uid", this.controller.updateUserPremium.bind(this.controller));
    this.router.delete("/test/delete/:email", this.controller.deleteUserByEmail.bind(this.controller));
  }
}
