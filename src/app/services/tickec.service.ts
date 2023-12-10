import ServiceConfig from "../../config/ServiceConfig";
import { Ticket } from "../dao/domain/ticket/Ticket";
import { TicketModel } from "../dao/domain/ticket/ticket.model";

export default class TicketService extends ServiceConfig<Ticket> {
  constructor() {
    super(TicketModel);
  }

  
}
