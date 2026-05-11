import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // BUG S-9 FIX: add connection options suitable for production
      maxPoolSize: 10,                  // max concurrent connections per Node instance
      serverSelectionTimeoutMS: 5000,   // fail fast if no server found within 5s
      socketTimeoutMS: 45000,           // drop idle sockets after 45s
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;