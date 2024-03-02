import ServiceConfig from "../../config/ServiceConfig";
import { User } from "../dao/domain/user/User";
import { UserModel } from "../dao/domain/user/user.model";

export default class UserService extends ServiceConfig<User> {
  constructor() {
    super(UserModel, "cart");
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.entityModel.findOne({ email });
  }

  public async findOneById(userId: string): Promise<User | null> {
    return await this.entityModel.findOne({ _id: userId });
  }

  public async deleteByEmail(email: string): Promise<number> {
    const deleteEntity = await this.entityModel.deleteOne({ email });
    return deleteEntity.deletedCount || 0;
  }

  public async deleteUsers(users: User[]): Promise<number> {
    const deleteEntity = await this.entityModel.deleteMany({ _id: { $in: users.map(u => u._id) } });
    return deleteEntity.deletedCount || 0;
  }
}