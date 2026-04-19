import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "MERN_AUTHENTICATION",
    }).then(() => {
        console.log("Mongoose");

    }).catch((err) => {
        console.error(`Some error occured while connecting to database: ${err}`);

    })
}