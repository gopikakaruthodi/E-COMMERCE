import axios from "axios";
import React, { useState, useEffect } from "react";
import Api from "../../API/Api";
import { useNavigate, useParams } from "react-router-dom";

const Cart = ({setUser,setProfile}) => {
  const navigate=useNavigate()
  const {_id}=useParams()
  const [addressData, setAddressData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("Token");
  const api = Api();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${api}/displaycart`, {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log(cartItems);
      setCartItems(data.cart)
      setUser(data.user.username)
        if(data.user.profile){
          setProfile(data.user.profile)
        }
      const res = await axios.get(`${api}/getAddress`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setAddressData(res.data.address);
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate('/signin')
    }
  };
  if(cartItems.length==0)
    navigate('/emptycart')

  const handleRemove = async (id) => {
    try {
      const { data } = await axios.delete(`${api}/removecartitem/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      alert(data.msg);
      fetchData();
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item.");
    }
  };

  const handleQuantityChange = async (_id, action) => {
    // Create a new array with the updated quantity
    const updatedItems = cartItems.map((item) =>
      item._id === _id
        ? {
            ...item,
            quantity: action === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          }
        : item
    );
  
    // Set the updated items in state (to reflect changes in the UI immediately)
    setCartItems(updatedItems);
    console.log("Updated cart items:", updatedItems);
  
    try {
      // Find the specific updated item
      const updatedItem = updatedItems.find((item) => item._id === _id);
      const updatedQuantity = updatedItem.quantity;
  
      // Make the API call to update the backend
      await axios.put(
        `${api}/updatequantity/${_id}`,
        { quantity: updatedQuantity },
        { headers: { authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
  
      // Optional: Revert state if the API call fails
      setCartItems(cartItems);
      alert("Error updating quantity. Please try again.");
    }
  };

  const handleCheckout = async() => {
    try {
      if (!selectedAddress) {
        alert("Please select a shipping address!");
        return;
      }
      console.log(cartItems);
      
      const cartQuantities = cartItems.map((item) => ({
        productID: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        size:item.size,
      }));
      console.log(cartQuantities);
      
      localStorage.setItem('QuantityData', JSON.stringify(cartQuantities));
      const res=await axios.post(`${api}/placeorders`,{selectedAddress,total},{ headers: { authorization: `Bearer ${token}` } });
      console.log(res);
      alert("Order placed successfully");
      navigate('/orderplaced')
  
    } catch (error) {
      console.log(error);
      
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };
  console.log(selectedAddress);
  

  const taxRate = 0.1; // 10% tax
  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const protectPromiseFee = 9;
  const total = subtotal + tax + protectPromiseFee;

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Cart Section */}
        <div className="flex-1 bg-white p-6 shadow-md rounded-lg overflow-y-auto lg:min-h-[600px]">
          <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="border-b pb-4 mb-4">
              <div className="flex flex-col sm:flex-row items-center">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-32 h-32 sm:w-52 sm:h-28 border rounded-xl object-cover"
                />
                <div className="mt-4 sm:mt-0 sm:ml-10">
                  <h3 className="text-lg text-gray-900">{item.product.productName}</h3>
                  <p className="text-gray-500">{item.product.productDetails}</p>
                  <p className="text-gray-900 font-semibold mt-1">₹{item.product.price}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 sm:mt-5 font-semibold">
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item._id, "decrement")}
                    disabled={item.quantity <= 1}
                    className={`px-2 py-1 rounded-md ${
                      item.quantity <= 1
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    -
                  </button>
                  <span className="mx-4">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, "increment")}
                    className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  className="text-red-500 text-md hover:underline"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Billing Section */}
        <div className="lg:w-[30%] bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg text-gray-500 font-bold mb-4">PRICE DETAILS</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Price</span>
            <span className="text-gray-700">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Tax (10%)</span>
            <span className="text-gray-700">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Delivery Charges</span>
            <span className="text-green-700">
              <span className="line-through text-gray-400 mr-1">₹70</span>Free
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Protect Promise Fee</span>
            <span className="text-gray-700">₹{protectPromiseFee}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-5">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          {/* Address Selection */}
          <div className="mt-6">
            <h2 className="text-lg text-gray-400 font-semibold mb-4">SELECT SHIPPING ADDRESS</h2>
            {addressData.map((address) => (
              <label
                key={address._id}
                className="flex items-center space-x-4 mb-3 p-4 border rounded-lg cursor-pointer hover:shadow-md transition"
              >
                <input
                  type="radio"
                  name="shippingAddress"
                  value={address.id}
                  checked={selectedAddress === address._id}
                  onChange={() => setSelectedAddress(address._id)}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <div className="text-gray-700">
                  <span>{address.place},</span> <span>{address.house},</span> <span>{address.pincode}</span>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
