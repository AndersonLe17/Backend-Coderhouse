import mongoose from "mongoose";

export default class MongoConnect {
  static connectDatabase(url: string): void {
    mongoose
      .connect(url)
      .then(() => console.log("DB is connected"))
      .catch((error) => console.log(`Error en MongoDB Atlas: ${error}`));
  }
}
