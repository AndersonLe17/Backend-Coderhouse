import { RouterConfig } from "../../config/RouterConfig";
import { MessageController } from "../controlller/message.controller";
import { authorizationUser } from "../middlewares/authorization.middleware";

export class MessageRouter extends RouterConfig<MessageController> {
  constructor() {
    super(MessageController, "/api/messages");
    this.routes();
  }

  public routes(): void {
    // GET ROUTES
    this.router.get("/", this.controller.getMessages.bind(this.controller));
    // POST ROUTES
    this.router.post("/", authorizationUser, this.controller.createMessage.bind(this.controller));
  }
}