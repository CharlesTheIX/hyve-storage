import mongoose from "mongoose";
import getEnvVars from "../getEnvVars";

export default async (): Promise<void> => {
  const vars = getEnvVars().mongo;
  try {
    const connection: typeof mongoose = await mongoose.connect(vars.uri);
    console.log(`MongoDB connect to host: ${connection.connection.host}`);
  } catch (err: any) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
