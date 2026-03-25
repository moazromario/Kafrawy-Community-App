// src/config/db.ts
import mongoose from 'mongoose';

const databaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mongodb') 
  ? process.env.DATABASE_URL 
  : "mongodb://localhost:27017/taxi_app";

export const connectDB = async () => {
  try {
    await mongoose.connect(databaseUrl);
    console.log('MongoDB Connected via Mongoose');
  } catch (error) {
    console.error('Database connection error:', error);
    // In a real app, we might want to exit if the DB is critical
    // process.exit(1);
  }
};
