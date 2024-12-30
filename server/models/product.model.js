import mongoose from "mongoose";

const productSchema=await mongoose.Schema({
    productName:{type:String},
    price:{type:Number},
    category:{type:String},
    sizes:[],
    images:[]
   
})

export default mongoose.model.products||mongoose.model('product',productSchema)