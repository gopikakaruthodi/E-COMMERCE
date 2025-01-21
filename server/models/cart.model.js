import mongoose from "mongoose";

const cartSchema=await mongoose.Schema({
    buyerID:{type:String},
    product:{type:Object},
    size:{type:String},
    quantity:{type:Number}
})

export default mongoose.model.carts||mongoose.model('cart',cartSchema)