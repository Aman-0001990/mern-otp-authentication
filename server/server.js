import { app } from "./app.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";



app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

})