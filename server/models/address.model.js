import mongoose from "mongoose";

const addrSchema=await mongoose.Schema({
    house:{type:String},
    place:{type:String},
    pincode:{type:String},
    userID:{type:String}
   
})

export default mongoose.model.address||mongoose.model('addres',addrSchema)