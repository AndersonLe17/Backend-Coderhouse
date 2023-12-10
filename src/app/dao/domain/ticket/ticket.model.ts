import mongoose from "mongoose";
import { Ticket } from "./Ticket";

export const TicketModel = mongoose.model<Ticket>("Tickets", new mongoose.Schema<Ticket>({
  code: { type: String, unique: true, auto: true },
  purchaseDateTime: { type: Date, default: Date.now},
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true }
}));
