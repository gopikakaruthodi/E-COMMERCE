import mongoose from "mongoose";

const categorySchema=await mongoose.Schema({
    category:{type:String}
})

export default mongoose.model.category||mongoose.model('category',categorySchema)