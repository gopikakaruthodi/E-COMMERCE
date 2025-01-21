import mongoose from "mongoose";

const wishListSchema=await mongoose.Schema({
    buyerID:{type:String},
    productID:{type:String}
})

export default mongoose.model.wishlist||mongoose.model('wishlist',wishListSchema)