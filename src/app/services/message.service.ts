import ServiceConfig from "../../config/ServiceConfig";
import { Message } from "../dao/domain/message/Message";
import { MessageModel } from "../dao/domain/message/message.model";

export class MessageService extends ServiceConfig<Message> {
  constructor() {
    super(MessageModel, "user");
  }

  public async findAllPopulate(): Promise<Message[]> {
    return this.entityModel.find().populate("user").lean();
  }

}
