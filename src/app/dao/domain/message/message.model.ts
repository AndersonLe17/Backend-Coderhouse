import mongoose, { Schema } from "mongoose";
import { Message } from "./Message";

export const MessageModel = mongoose.model<Message>("Messages", new  mongoose.Schema<Message>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  message: { type: String, required: true }
}));