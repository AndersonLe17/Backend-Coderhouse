import { HttpResponse } from "../../config/HttpResponse";
import { Message } from "../dao/domain/message/Message";
import { MessageError } from "../dao/domain/message/message.error";
import { MessageService } from "../services/message.service";
import { Request, Response } from "express";

export class MessageController {
  private readonly messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  public async getMessages(_req: Request, res: Response) {
    const messages = await this.messageService.findAllPopulate();
    HttpResponse.Ok(res, messages);
  }

  public async createMessage(req: Request, res: Response) {
    const message = req.body as Message;
    const newMessage = await this.messageService.create(message);

    if (newMessage) {
      const messagePopulate = await this.messageService.findById(newMessage._id!);
      req.app.get("io").emit("ioMessage", { action: "Add", payload: messagePopulate });
      HttpResponse.Created(res, messagePopulate);
    } else {
      throw new MessageError("Message not created");
      // HttpResponse.BadRequest(res, "Error al crear el mensaje");
    }
  }

}
