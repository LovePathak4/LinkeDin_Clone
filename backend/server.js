import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';
import postController from "./controllers/posts.controller.js";


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());



app.use("/api/posts", postRoutes);









const start = async () => {

    const connectDB = await mongoose.connect(process.env.MONGODB_URI)



    app.listen(9080, () => {
        console.log("Server is running on port 9080");

    })
}

start();
