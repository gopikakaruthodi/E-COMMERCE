import userSchema from './models/user.model.js'
import addrSchema from './models/address.model.js'
import companySchema from './models/company.model.js'
import categorySchema from './models/category.model.js'
import productSchema from './models/product.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer"


const{sign}=jwt

const transporter = nodemailer.createTransport({
    service:"gmail",
     auth: {
       user: "jazzcazz02@gmail.com",
       pass: "huhm lfcr wtaj qgbg",
     },
   });
 

export async function signup(req,res) {
    try {
        const {...data}=req.body
        const {username,password,cpassword,email,phone,accountType}=req.body
        // console.log(data);
        if(!(username&&email&&phone&&password&&cpassword&&accountType))
            return res.status(404).send({msg:"Oops! You forgot to fill in the fields."})
        const user=await userSchema.findOne({email})
        
        if(user)
            return res.status(404).send({msg:"This email address is already registered."})
        if(password!=cpassword)
            return res.status(404).send({msg:"Passwords do not match. Please try again."})
        bcrypt.hash(password,10).then(async(hashedPassword)=>{
            // console.log(hashedPassword);
            await userSchema.create({username,password:hashedPassword,email,phone,accountType}).then(()=>{
                res.status(201).send({msg:"Registration successful! You can now log in"})
            }).catch((error)=>{
                console.log(error); 
                return res.status(404).send({msg:error})
            })
        })
       
        
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})
        
    }
    
}

export async function signin(req,res) {
    try {
        const {email,password}=req.body
        const user=await userSchema.findOne({email})
        if(!user)
            return res.status(404).send({msg:"This email address is not registered. Please check and try again."})
        const checkpassword=await bcrypt.compare(password,user.password)
        if(!checkpassword)
            return res.status(404).send({msg:"Invalid password. Please try again"})
        const token=await sign({userId:user._id},"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",{expiresIn:'24h'})
        // console.log(token);
        res.status(200).send({msg:"Welcome! You’re logged in now.",token})
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})

        
    }
    
}

export async function checkEmail(req,res) {
    try {
        try {
            const {email}=req.body
            const info = await transporter.sendMail({
                from: 'jazzcazz02@gmail.com', // sender address
                to: `${email}`, // list of receivers
                subject: "Email Verification", // Subject line
                text: "Verification", // plain text body
                html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Verification</title>
            <style>
                body {
                    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #3d3d3d;
                    border-radius: 6px;
                }
                .email-container {
                    width: 100%;
                    max-width: 300px;
                    margin: 0 auto;
                    background-color: #eff7fa;
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                }
                .btn {
                    display: inline-block;
                    background-color: rgb(17, 161, 251);
                    color: #fff;
                    text-decoration: none;
                    padding: 10px 20px;
                    margin-top: 20px;
                    border-radius: 50px;
                    font-size: 18px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
    
            <div class="email-container">
                <p>Hello Sir/Madam</p>
                <p>Please verify your email address by clicking the button below.</p>
                <a href="http://localhost:5173/signup" class="btn">Verify Your Account</a>
            </div>
    
        </body>
        </html>`, // html body
              });
            
            res.status(200).send({msg:"Email verified successfully! You can now log in to your account."})
        } catch (error) {
            console.log(error);
            res.status(404).send({msg:error})    
                 
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})  
    }
    
}

export async function displayProfile(req,res) {
   try {
    // console.log(req.user);
    const _id=req.user
    const data=await userSchema.findOne({_id})
    res.status(200).send(data)
    
   } catch (error) {
        console.log(error);
        
   }
}
export async function editProfile(req,res) {
   try {
    // console.log(req.user);
    const _id=req.user
    const {...data}=req.body
    // console.log(data);
    
    await userSchema.updateOne({_id},{$set:{...data}}).then(()=>{
        res.status(201).send({msg:'Changes to your profile have been saved.'})
    }).catch((error)=>{
        console.log(error);
        res.status(404).send({msg:error})  
    })
    
   } catch (error) {
        console.log(error);
        
   }
}

export async function addAddress(req,res){
    try {
        const{house,place,pincode}=req.body
        if(!(house&&place&&pincode))
            return res.status(404).send({msg:"Oops! You forgot to fill in the fields."})
        await addrSchema.create({house,place,pincode}).then(()=>{
            res.status(201).send({msg:"New address added to your profile"})
        }).catch((error)=>{
            res.status(404).send({msg:error})  
        })

    } catch (error) {
        console.log(error);
        
    }
}


export async function displayAddress(req,res) {
    try {
        const {...addr}=req.body
        const address=await addrSchema.find()
        res.status(200).send(address)
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})    
    }
}
export async function editAddress(req,res) {
    try {
        const _id=req.params
        const {...addr}=req.body
        await addrSchema.updateOne({_id},{$set:{...addr}}).then(()=>{
            res.status(201).send({msg:"Address Successfully Updated"})
        }).catch((error)=>{
            console.log(error);
            
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})    
    }
}

export async function deleteAddress(req,res) {
    try {
        const _id=req.params
        const address=await addrSchema.deleteOne({_id}).then(()=>{
            res.status(200).send({msg:'Successfully Deleted'})
        }).catch((error)=>{
            console.log(error);
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})    
    }
}

// company details
export async function editComapany(req,res){
    try {
        const{name,email,phone,place}=req.body
        // console.log(username,email)
        const _id=req.user
        // console.log(_id);
        const user=await companySchema.findOne({userID:_id})
        // console.log(user);
        if(!user){
            await companySchema.create({name,email,phone,place,userID:_id}).then(()=>{
               return res.status(201).send({msg:"Successfully Added"})
            }).catch((error)=>{
                console.log(error);
                res.status(404).send({msg:error})    
            })
        }
        else{
            await companySchema.updateOne({userID:_id},{$set:{name,email,phone,place}}).then(()=>{
               return res.status(201).send({msg:"Successfully Updated"})
            }).catch((error)=>{
                console.log(error);
                res.status(404).send({msg:error})    
            })
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})      
    }
}
export async function getCompany(req,res){
    try {
    //    console.log(req.user.userId);
       const userID=req.user
       const companyData= await companySchema.findOne({userID})
    //    console.log(companyData);
       res.status(200).send(companyData)
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}
// add category

export async function category(req,res){
    try {
        const{newCategory}=req.body
        await categorySchema.create({category:newCategory}).then(()=>{
            return res.status(201).send({msg:"Category Added"})
         }).catch((error)=>{
             console.log(error);
             res.status(404).send({msg:error})    
         })
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}
export async function getCategory(req,res){
    try {
       const category= await categorySchema.find()
       res.status(200).send(category)
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}
// add products
export async function addProduct(req,res){
    try {
        const{productName,price,sizes,category,images}=req.body
        await productSchema.create({productName,price,sizes,category,images}).then(()=>{
            return res.status(201).send({msg:"Product Added"})
         }).catch((error)=>{
             console.log(error);
             res.status(404).send({msg:error})    
         })
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}

export async function getProducts(req,res){
    try {
        const products= await productSchema.find()
       res.status(200).send(products)
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}
export async function getCatProducts(req,res){
    try {
        const{category}=req.params
        const products= await productSchema.find({category})
        res.status(200).send(products)
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}

