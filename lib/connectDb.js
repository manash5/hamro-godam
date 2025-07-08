import mongoose from "mongoose"; 

const connectToDB = async () => {
    if (mongoose.connection.readyState === 1) {
    return;
  }
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URL || '', {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

export default connectToDB; 