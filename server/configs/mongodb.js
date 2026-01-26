import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }

        mongoose.connection.once('connected', () => {
            console.log('✅ Database Connected!');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB || 'clone-lms',
        });

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        process.exit(1); // stop app nếu DB không kết nối được
    }
};

export default connectDB;
