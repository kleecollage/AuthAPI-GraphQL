import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connection to MongoDB ok')
  } catch (error) {
    console.log('DB connection failed: ', error)
  }
}