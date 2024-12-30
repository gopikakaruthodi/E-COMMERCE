import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./components/Home/Home"
import Signin from "./components/SIGNIN/Signin"
import Signup from "./components/SIGNUP/Signup"
import Email from "./components/EMAIL/Email"
import Profile from "./components/PROFILE/Profile"
import Sell from "./components/SELL/Sell"
import EditComapany from "./components/SELL/EditCompany"
import AddProduct from "./components/AddProduct/AddProduct"
import Products from "./components/Product/Product"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home}/>
        <Route path="/signin" Component={Signin}/>
        <Route path="/signup" Component={Signup}/>
        <Route path="/email" Component={Email}/>
        <Route path="/profile" Component={Profile}/>
        <Route path="/sell" Component={Sell}/>
        <Route path="/editcompany" Component={EditComapany}/>
        <Route path="/addproduct" Component={AddProduct}/>
        <Route path="/products/:category" Component={Products}/>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
