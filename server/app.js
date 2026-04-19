import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from './database/db_connection.js';
import { errorMiddleware } from "./middlewares/error.js";
import userRouter  from "./routes/userRouter.js";
import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
config({
    path: ".env",
    override: true,
});

// const { default: userRouter } = await import("./routes/userRouter.js");
export const app = express();
app.use(cors(
    {
        origin: [process.env.FRONTEND_URL, "http://localhost:5173", "https://localhost:5173", "https://portfolio-aman-1.netlify.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user",userRouter);
removeUnverifiedAccounts();
connection();

app.use(errorMiddleware);