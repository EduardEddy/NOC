import mongoose from "mongoose";
import { MongoDatabase } from "./init";

describe("init MongoDB", () => {

  afterAll(() => {
    mongoose.connection.close();
  });

  test('should connect to MongoDB', async () => {
    console.log('Console init test', process.env.PORT)

    const connected = await MongoDatabase.connect({
      dbName: process.env.MONGO_DB_NAME!,
      mongoUrl: process.env.MONGO_URL!,
    });

    expect(connected).toBe(true);

  });

  test("should check console log", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const consoleSpy2 = jest.spyOn(console, "log");

    await MongoDatabase.connect({
      dbName: process.env.MONGO_DB_NAME!,
      mongoUrl: process.env.MONGO_URL!,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Connected to Mongo');
    expect(consoleSpy2).toHaveBeenCalledWith('second console log');
    consoleSpy.mockRestore(); // Restaura el `console.log` original
    consoleSpy2.mockRestore(); // Restaura el `console.log` original
  });

  test('should throw an error ', async () => {
    try {
      const connected = await MongoDatabase.connect({
        dbName: process.env.MONGO_DB_NAME!,
        mongoUrl: process.env.MONGO_URL!,
      });
      expect(true).toBe(false);
    } catch (error) {

    }
  });
});