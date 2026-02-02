import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        // console.log('✅ Database Connected!');
        console.log('🥤 Database connected and fully caffeinated!');
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
};

export default connectDB;
