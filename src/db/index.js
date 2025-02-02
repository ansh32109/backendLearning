import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Returned value from connect: ${connectionInstance} \n`);
        console.log(`MongoDB connected successfully! DB host at: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Error: ", error);
        process.exit(1)
    }
}

export default connectDB