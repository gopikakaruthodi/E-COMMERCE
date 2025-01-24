import userSchema from './models/user.model.js'
import addrSchema from './models/address.model.js'
import companySchema from './models/company.model.js'
import categorySchema from './models/category.model.js'
import productSchema from './models/product.model.js'
import wishListSchema from './models/wishlist.model.js'
import cartSchema from './models/cart.model.js'
import orderSchema from './models/orders.model.js'
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
            return res.status(404).send({msg:"Invalid password.Try again"})
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

export async function changePassword(req,res) {
    try {
        const{password,cpassword,email}=req.body
        const user=await userSchema.findOne({email})
        if(!user)
            res.status(404).send({msg:"invalid user"})
         if(password!=cpassword)
            return res.status(404).send("Password Mismatch")
         bcrypt.hash(password,10).then(async(hashedPassword)=>{
            //  console.log(hashedPassword); 
             await userSchema.updateOne({email},{$set:{password:hashedPassword}}).then(()=>{
                 res.status(201).send({msg:"Your Password has been reset"})
             }).catch((error)=>{
                 res.status(404).send({msg:error})
             }) 
         }) 
    } catch (error) {
        console.log(error);
    } 
}

export async function displayProfile(req,res) {
   try {
    // console.log(req.user);
    const _id=req.user
    const user=await userSchema.findOne({_id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})
    const data=await userSchema.findOne({_id})
    // console.log(data);
    
    res.status(200).send({data,user})
    
   } catch (error) {
        console.log(error);
        
   }
}
export async function editProfile(req,res) {
   try {
    // console.log(req.user);
    const _id=req.user
    const {...data}=req.body
    console.log(data);
    
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
        const id=req.user
        const{house,place,pincode}=req.body
        if(!(house&&place&&pincode))
            return res.status(404).send({msg:"Oops! You forgot to fill in the fields."})
        await addrSchema.create({house,place,pincode,userID:id}).then(()=>{
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
        const id=req.user
        const {...addr}=req.body
        const user=await userSchema.findOne({_id:id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})

        const address=await addrSchema.find({userID:id})
        res.status(200).send({address,user})
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
        const{name,email,phone,place,profile}=req.body
        // console.log(profile)
        const _id=req.user
        // console.log(_id);
        const user=await companySchema.findOne({userID:_id})
        // console.log(user);
        if(!user){
            await companySchema.create({name,email,phone,place,userID:_id,profile}).then(()=>{
               return res.status(201).send({msg:"Successfully Added"})
            }).catch((error)=>{
                console.log(error);
                res.status(404).send({msg:error})    
            })
        }
        else{
            await companySchema.updateOne({userID:_id},{$set:{name,email,phone,place,profile}}).then(()=>{
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
       const user=await userSchema.findOne({_id:userID},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})
       const companyData= await companySchema.findOne({userID})
    //    console.log(companyData);
       res.status(200).send({companyData,user})
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
        const id=req.user        
        const{productName,price,sizes,category,images,productDetails}=req.body
        await productSchema.create({productName,price,sizes,category,images,productDetails,sellerID:id}).then(()=>{
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
        const id=req.user
        const user=await userSchema.findOne({_id:id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})
        const products= await productSchema.find({sellerID:id})
       res.status(200).send({products,user})
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}
export async function getProduct(req,res){
    try {
        const bid=req.user  
        const user=await userSchema.findOne({_id:bid},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})      
        const {_id}=req.params
        const products= await productSchema.findOne({_id})
        const isOnWishlist=await wishListSchema.findOne({productID:_id,buyerID:bid})
        
        const isOnCart=await cartSchema.findOne({"product._id":_id,buyerID:bid})
        
        res.status(200).send({products,isOnWishlist,isOnCart,user})
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

// edit product

export async function editProduct(req,res){
    try {
        const{_id}=req.params;
        const{productName,price,sizes,category,images}=req.body
        await productSchema.updateOne({_id},{$set:{productName,price,sizes,category,images}}).then(()=>{
            res.status(201).send({msg:"Product Details Updated"})
         }).catch((error)=>{
             console.log(error);
             res.status(404).send({msg:error})    
         })
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}
export async function deleteProduct(req,res){
    try {
        const{_id}=req.params;
        await productSchema.deleteOne({_id}).then(()=>{
            res.status(200).send({msg:"Product successfully deleted"})
         }).catch((error)=>{
             console.log(error);
             res.status(404).send({msg:error})    
         })
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})            
    }
}

export async function displayProducts(req,res){
    try {
        const _id=req.user
        const user=await userSchema.findOne({_id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})
        // console.log(req.user);
        const products= await productSchema.find({sellerID:{$ne:_id}})
        // console.log(products);
        res.status(200).send({products,user})
    } catch (error) {
        console.log(error);
        
    }
}


export async function addToWishlist(req,res) {
    try {
     const _id=req.user
     const {id}=req.body  
     const user=await userSchema.findOne({_id},{username:1,profile:1})
    if(!user)
        res.status(404).send({msg:'Invalid user'})   
     const isExisting= await wishListSchema.findOne({productID:id})
     if(!isExisting){
         await wishListSchema.create({buyerID:_id,productID:id,user}).then(()=>{
             return res.status(200).send({msg:"Added To Wishlist"})
         }).catch((error)=>{
            console.log(error);
            return res.status(404).send({msg:"Error"})
         })
     }
     else{
         return res.status(404).send({msg:" Already Existing"})
     }
    
    } catch (error) {
        console.log(error);
        
         return res.status(404).send({msg:"error"})
    }   
 }
 
 export async function removeFromWishlist(req,res) {
     try {
      const _id=req.user      
      const {id}=req.params
      
      await wishListSchema.deleteOne({$and:[{buyerID:_id},{productID:id}]}).then(()=>{
          return res.status(200).send({msg:"Removed From Wishlist"});
      }).catch((error)=>{
        console.log(error);
        return res.status(404).send({msg:"Error"})
      })
     } catch (error) {
        console.log(error);
          return res.status(404).send({msg:"error"})
     }   
  }

  export async function displayWishlist(req,res) {
    try {
        const _id=req.user
        console.log(_id);
        
        const user=await userSchema.findOne({_id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})

        const wish=await wishListSchema.find({buyerID:_id})
        console.log(wish);
        
        const dataPromises = wish.map(async (data) => {
            return await productSchema.findOne({ _id: data.productID});
        });
        console.log(dataPromises);
        
        const products = await Promise.all(dataPromises);
        console.log(products);
        
        res.status(200).send({products,user})
    } catch (error) {
        console.log(error);
        
    }
  }
  

// cart
  export async function addToCart(req,res) {
    try {
        const {product,selectedSize}=req.body;
        const id=req.user;
        await cartSchema.create({buyerID:id,product,size:selectedSize,quantity:1}).then(()=>{
            return res.status(201).send({msg:"Added to Cart"});
        }).catch((error)=>{
            return res.status(404).send({msg:"error"})
        })
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}
export async function displayCart(req,res) {
    try {
        const id=req.user;
        const user=await userSchema.findOne({_id:id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})
        
        const cart=await cartSchema.find({buyerID:id});
        res.status(200).send({cart,user})
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}
export async function singleCart(req,res) {
    try {
        const id=req.user;
        const user=await userSchema.findOne({_id:id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})
        const {_id}=req.params;
        const cart=await cartSchema.findOne({buyerID:id,"product._id":_id});
        // console.log(cart);
        
        res.status(200).send({cart,user})
    } catch (error) {
        console.log(error);
        
        return res.status(404).send({msg:"error"})
    }
}
export async function removeCartItem(req,res) {
    try {
        const {_id}=req.params
        // console.log(_id);
        await cartSchema.deleteOne({_id}).then(()=>{
            return res.status(200).send({msg:"Removed From Cart"})
        })
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}
export async function updateQuantity(req,res) {
    try {
        const id=req.user
        const {_id}=req.params
        const {quantity}=req.body
        // console.log(quantity);
        await cartSchema.updateOne({_id},{$set:{quantity}}).then(()=>{
            return res.status(200).send({msg:"Quantity updated"})
        })
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}
 

// order

export async function addOrders(req, res) {
    try {
        const {selectedAddress,total}=req.body;
        const _id = req.user;
        const cart = await cartSchema.find({ buyerID:_id}); 
        
        const address=await addrSchema.findOne({_id:selectedAddress})
        // console.log(address);
        
        
        if (!cart || cart.length===0)
            return res.status(404).send({ msg:"Your cart is empty"});

        const cartPromises=await cart.map(async(data)=>{
            const size=data.size
            // console.log(size);
            
            const product=await productSchema.findOne({_id:data.product._id})
            // console.log(quantity);
            
            const sizeQuantity= product.sizes.find((d)=>d.size===size)
            // console.log(sizeQuantity);
            // console.log(data.quantity,sizeQuantity.quantity);
            
            if(data.quantity <= sizeQuantity.quantity){
                // const newQuantity = sizeQuantity.quantity - data.quantity;
                // await productSchema.updateOne({_id: data.product._id, "sizes.size": size }, {  $set: { "sizes.$.quantity": newQuantity }  });
                await cartSchema.deleteOne({ buyerID: _id, "product._id": data.product._id });
                await orderSchema.create({ buyerID: _id, product: data.product, address:address,total:total}).then(()=>{

                    res.status(201).send({ msg: "Orders placed successfully"});
                }).catch((error)=>{
                     res.status(404).send(error);
                })
            }
            else{
                throw new Error("Insufficient stock for product");
            }
            
        })
    } catch (error) {
        console.error(error);
        return res.status(404).send(error);
    }
}

export async function getOrders(req,res){
    try {
        const id=req.user
        const user=await userSchema.findOne({_id:id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})
        const orders=await orderSchema.find({buyerID:id})
        res.status(200).send({orders,user});
    } catch (error) {
        console.log(error);
        
    }
}
export async function forConfirmOrder(req,res){
    try {
        const id=req.user
        const user=await userSchema.findOne({_id:id},{username:1,profile:1})
        if(!user)
            res.status(404).send({msg:'Invalid user'})
        const orders=await orderSchema.find({"product.sellerID": id})
        res.status(200).send({orders,user});
    } catch (error) {
        console.log(error);
        
    }
}
export async function acceptOrder(req,res){
    try {
        const id=req.user
        const {oid}=req.params
        console.log(req.body);
        
        const quantityData=req.body
        console.log(quantityData);
        
        const order=await orderSchema.findOne({_id:oid})
        console.log(order)
        if(!order)
            return res.status(404).send({ msg:"no orders"});
        
        const pid = order.product._id

        const productPromise = quantityData.map(async(d)=>{
            if(pid===d.productID){
                const size = d.size
                const quantity = d.quantity;
                await productSchema.updateOne(
                    { _id: pid,"sizes.size":d.size }, // Find the product by its ID
                    { $inc: { "sizes.$.quantity": -quantity } } // Decrease quantity
                );
                const accept=await orderSchema.updateOne({"product.sellerID": id , "product._id": pid , confirm:false}, {$set:{confirm:true}})
            }
        })

    // await Promise.all(productPromise)

        const seller= await userSchema.findOne({_id:id})
        const buyer= await userSchema.findOne({_id:order.buyerID})
        // console.log(accept , seller , buyer);
        
        const info = await transporter.sendMail({
            from: `${seller.email}`, // sender address
            to: `${buyer.email}`, // list of receivers
            subject: "Product Confirmation", // Subject line
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
            <p>Your order is confirmed 👍 </p>
            <p>product will be delivering soon... </p>
            <a href="http://localhost:5173/home" class="btn">view more</a>
        </div>

    </body>
    </html>`, 
        });


        res.status(200).send({msg:"Order Confirmed ",msg1:"email sent"});
    } catch (error) {
        console.log(error);
    }
}

export async function rejectOrder(req,res) {
    try {
        const id=req.user
        const {oid}=req.params
        console.log(oid);
        
    
        const order=await orderSchema.findOne({_id:oid})

        if(!order)
            return res.status(404).send({ msg:"no orders"});

        const seller= await userSchema.findOne({_id:id})
        const buyer= await userSchema.findOne({_id:order.buyerID})
        const info = await transporter.sendMail({
            from: `${seller.email}`, // sender address
            to: `${buyer.email}`, // list of receivers
            subject: "Product Confirmation", // Subject line
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
            <p>Your order is Rejected </p>
            <p>Please order again...something went wrong </p>
            <a href="http://localhost:5173/home" class="btn">View Products</a>
        </div>

    </body>
    </html>`, });
    res.status(200).send({msg:"Order Rejected"});
 
    } catch (error) {
        
    }
}

