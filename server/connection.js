import mongoose from "mongoose";

export default async function Connection(){
    const db=await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce")
    return db
}