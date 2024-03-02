import _ from "mongoose-paginate-v2";
import { RouterConfig } from "../../config/RouterConfig";
import { UserController } from "../controlller/user.controller";
import { authenticationLogin } from "../middlewares/authentication.middleware";
import { upload } from "../middlewares/multer.middleware";
import { authorizationAdmin } from "../middlewares/authorization.middleware";

export class UserRouter extends RouterConfig<UserController> {

  constructor() {
    super(UserController, "/api/users");
    this.routes();
  }

  public routes(): void {
    this.router.get("/profile", authenticationLogin, this.controller.getUserByEmailToken.bind(this.controller));
    this.router.get("/cart", authenticationLogin, this.controller.getUserByToken.bind(this.controller));
    this.router.get("/", this.controller.getUsers.bind(this.controller));
    this.router.get("/find/:uid", this.controller.getUserById.bind(this.controller));
    this.router.put("/premium/:uid", this.controller.updateUserPremium.bind(this.controller));
    this.router.put("/role/:uid", authorizationAdmin, this.controller.updateUserRole.bind(this.controller));
    this.router.post("/:uid/documents", authenticationLogin, upload.array('files'), this.controller.updateDocuments.bind(this.controller));
    this.router.post("/:uid/profile", authenticationLogin, upload.single('file'), this.controller.updateProfile.bind(this.controller));
    this.router.delete("/test/delete/:email", this.controller.deleteUserByEmail.bind(this.controller));
    this.router.delete("/:uid", authorizationAdmin, this.controller.deleteUserById.bind(this.controller));
    this.router.delete("/", this.controller.deleteUsersOffline.bind(this.controller));
  }
}
