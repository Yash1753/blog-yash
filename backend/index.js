import express from "express";
import cors from "cors";
import dotenv  from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js";


dotenv.config();
import { connectDB } from "./database/db.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors());

app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/blog" , blogRoutes);
app.use("/api/v1/auth" , commentRoutes);


app.use(errorHandler);
const startServer = async()=>{
    try{
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`server is running on port : ${process.env.PORT}`)
        })
    }catch(e){
        console.error("Failed to start server:", e);
    }
}

startServer();