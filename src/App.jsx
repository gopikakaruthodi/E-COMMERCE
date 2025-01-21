import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./components/HOME/Home"
import Signin from "./components/SIGNIN/Signin"
import Signup from "./components/SIGNUP/Signup"
import Email from "./components/EMAIL/Email"
import Profile from "./components/PROFILE/Profile"
import Sell from "./components/SELL/Sell"
import EditComapany from "./components/SELL/EditCompany"
import AddProduct from "./components/AddProduct/AddProduct"
import Products from "./components/Product/Product"
import ProductDetails from "./components/ProductDetails/ProductDetails"
import EditProduct from "./components/EditProduct/EditProduct"
import ProductFullDetails from "./components/productFullDetails.jsx/ProductFullDetails"
import Wishlist from "./components/Wishlist/Wishlist"
import Cart from "./components/Cart/Cart"
import Navbar from "./components/Navbar/Navbar"
import OrderPlaced from "./components/Order/OrderPlcaed"
import EmptyCart from "./components/Cart/EmptyCart"
import BuyNowPage from "./components/BuyNow.jsx/BuyNow"
import OrdersList from "./components/Order/OrdersList"
import SellOrdersList from "./components/Order/Sell-OrderList"
import { useState } from "react"

function App() {
  const showNav = location.pathname !== '/signin' && location.pathname !== '/signup';
  const [user,setUser]=useState("")
  const [profile,setProfile]=useState("")

  return (

    <>
    <BrowserRouter>
    {user && <Navbar user={user} profile={profile}  />} {/* Conditionally render the Nav */}
    <Routes>
        <Route path="/" element={<Home setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/signin" Component={Signin}/>
        <Route path="/signup" Component={Signup}/>
        <Route path="/email" Component={Email}/>
        <Route path="/profile" element={<Profile setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/sell" element={<Sell setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/editcompany" Component={EditComapany}/>
        <Route path="/addproduct" Component={AddProduct}/>
        <Route path="/products/:category" Component={Products}/>
        <Route path="/Productdetails/:_id" element={<ProductDetails setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/Productfulldetails/:_id" element={<ProductFullDetails setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/editproduct/:_id" Component={EditProduct}/>
        <Route path="/orderplaced" Component={OrderPlaced}/>
        <Route path="/wishlist" element={<Wishlist setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/cart" element={<Cart setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/emptycart" Component={EmptyCart}/>
        <Route path="/buynow/:_id" element={<BuyNowPage setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/orderslist" element={<OrdersList setUser={setUser} setProfile={setProfile} />}/>
        <Route path="/sellorderslist" element={<SellOrdersList setUser={setUser} setProfile={setProfile} />}/>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
