const mongoose = require('mongoose');

const connectDB = async () => {
  // In serverless (Vercel), connections can drop. 
  // We check Mongoose's internal state rather than a static boolean.
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout early to prevent exact Vercel freeze
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    // Rethrow to let the middleware catch it and send a 500 response
    throw err;
  }
};

module.exports = connectDB;
