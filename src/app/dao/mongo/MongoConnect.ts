import mongoose from "mongoose";
import { logger } from "../../../utils/logger/winston";

export default class MongoConnect {
  static connectDatabase(url: string): void {
    mongoose
      .connect(url)
      .then(() => logger.info("DB is connected"))
      .catch((error) => logger.info(`Error en MongoDB Atlas: ${error}`));
  }
}
