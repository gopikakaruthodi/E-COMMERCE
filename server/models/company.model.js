import mongoose from "mongoose";

const companySchema=await mongoose.Schema({
    name:{type:String},
    place:{type:String},
    email:{type:String},
    phone:{type:String},
    profile:{type:String},
    userID:{type:String}
   
})

export default mongoose.model.companies||mongoose.model('company',companySchema)