import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    buyerID:{type:String},
    product:{type:Object},
    address:{type:Object},
    total:{type:Number},
    confirm:{type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,  // Automatically sets the current date and time when the document is created
      },
}) 

export default mongoose.model.Orders || mongoose.model("Order",orderSchema);