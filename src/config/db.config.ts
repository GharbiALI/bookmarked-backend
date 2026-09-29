import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB(): Promise<void> {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (err: any) {
    console.error("Database connection failed:");
    console.error(err.message);

    process.exit(1);
  }
}
