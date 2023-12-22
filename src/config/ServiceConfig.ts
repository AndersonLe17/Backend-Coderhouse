import { Model, PaginateModel } from "mongoose";

export default class ServiceConfig<T> {
  protected readonly entityModel: Model<T> | PaginateModel<T>;
  protected readonly populate: string;

  constructor(EntityModel: Model<T> | PaginateModel<T>, populate?: string) {
    this.entityModel = EntityModel;
    this.populate = populate || "";
  }

  public async findAll(): Promise<T[]> {
    return await this.entityModel.find().lean();
  }

  public async findById(id: string): Promise<T | null> {
    return await this.entityModel.findById(id).populate(this.populate).lean();
  }

  public async findOne(query: any): Promise<T | null> {
    return await this.entityModel.findOne(query);
  }

  public async create(entity: T): Promise<T> {
    return await this.entityModel.create(entity);
  }

  public async update(id: string, entity: T): Promise<T | null> {
    return await this.entityModel.findByIdAndUpdate(id, entity!, {
      returnDocument: "after",
    });
  }

  public async delete(id: string): Promise<number> {
      const deleteEntity = await this.entityModel.deleteOne({ _id: id });
      return deleteEntity.deletedCount || 0;
  }
}
