import mongoose from "mongoose";

const userSchema=await mongoose.Schema({
    username:{type:String},
    email:{type:String},
    phone:{type:String},
    password:{type:String},
    cpassword:{type:String},
    accountType:{type:String},
    profile:{type:String , default :'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'}
})

export default mongoose.model.users||mongoose.model('user',userSchema)