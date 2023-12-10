import { HttpResponse } from "../../config/HttpResponse";
import { Message } from "../dao/domain/message/Message";
import { MessageService } from "../services/message.service";
import { Request, Response } from "express";

export class MessageController {
  private readonly messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  public async getMessages(_req: Request, res: Response) {
    try {
      const messages = await this.messageService.findAllPopulate();

      HttpResponse.Ok(res, messages);
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }

  public async createMessage(req: Request, res: Response) {
    try {
      const message = req.body as Message;
      const newMessage = await this.messageService.create(message);

      if (newMessage) {
        const messagePopulate = await this.messageService.findById(newMessage._id!);
        req.app.get("io").emit("ioMessage", { action: "Add", payload: messagePopulate });
        HttpResponse.Created(res, messagePopulate);
      } else {
        HttpResponse.BadRequest(res, "Error al crear el mensaje");
      }
    } catch (error) {
      HttpResponse.InternalServerError(res, (error as Error).message);
    }
  }
}
