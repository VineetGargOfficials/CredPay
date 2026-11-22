import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<CLUSTER_ADDRESS>')) {
    console.log(`ℹ️  MongoDB Atlas Notice: Ready to connect with user 'contactvineetgarg_db_user'.`);
    console.log(`👉 Please provide or replace '<CLUSTER_ADDRESS>' in server/.env with your cluster host (e.g. cluster0.abcde.mongodb.net).`);
    console.log(`👉 Running in seamless zero-dependency synchronized mode in the meantime.`);
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Warning: ${error.message}`);
    console.warn(`👉 Using in-memory store so CredPay continues working smoothly.`);
    return false;
  }
};
