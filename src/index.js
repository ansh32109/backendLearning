import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config({
    path: './env'
})

connectDB()
        .then(() => {
            app.listen(process.env.PORT || 8000, () => {
                console.log(`Server is running at port: ${process.env.PORT || 8000}`);
                
            })
        })
        .catch((err) => {
            console.log("MongoDB connection failed!", err);
            app.on("error", (error) => {
                console.log(`Error occured: ${error}`);
                throw error
            })
        })