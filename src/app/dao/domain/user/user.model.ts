import mongoose, { Schema } from "mongoose";
import { User } from "./User";

export const UserModel = mongoose.model<User>("Users", new mongoose.Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {type: String, required: true, unique: true},
  age: {type: Number, required: true},
  password: {type: String, required: true},
  cart: {type: Schema.Types.ObjectId, ref: 'Carts'},
  role: {type: String, enum: ['admin', 'user', 'premium'], default: 'user', required: true},
  fromGithub: {type: Boolean, default: false, required: true},
  isforgottenPassword: {type: Boolean, default: false, required: true},
  documents: {
    type: [
      {
        name: {type: String, required: true},
        reference: {type: String, required: true},
        _id: false
      }
    ],
    default: []
  },
  profile: {type: String},
  lastConnection: {type: Date},
  status: {type: String, enum: ['active', 'inactive', 'verified'], default: 'active', required: true}
}));