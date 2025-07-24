import mongoose from 'mongoose';

/**
 * Database connection configuration
 * Connects to MongoDB using Mongoose
 */
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection FAILED:", error);
        process.exit(1);
    }
};

export default connectDB;
