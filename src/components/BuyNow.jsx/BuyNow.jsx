import axios from "axios";
import React, { useState, useEffect } from "react";
import Api from "../../API/Api";
import { useNavigate, useParams } from "react-router-dom";

const BuyNowPage = ({setUser,setProfile}) => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [addressData, setAddressData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState(null); // Initially null as it's a single product
  const token = localStorage.getItem("Token");
  const api = Api();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch the cart (single product in this case)
      const { data } = await axios.get(`${api}/singlecart/${_id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setCartItems(data.cart);
      setUser(data.user.username)
      if(data.user.profile){
        setProfile(data.user.profile)
      }

      // Fetch the address data
      const res = await axios.get(`${api}/getAddress`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setAddressData(res.data.address);
    } catch (error) {
      console.error(error);
      // navigate('/signin') if needed
    }
  };

  const handleQuantityChange = async (action) => {
    // Update quantity based on action (increment or decrement)
    const updatedQuantity = action === "increment" ? cartItems.quantity + 1 : Math.max(1, cartItems.quantity - 1);
    setCartItems({ ...cartItems, quantity: updatedQuantity });

    try {
      // Update quantity on the backend
      await axios.put(
        `${api}/updatequantity/${cartItems._id}`,
        { quantity: updatedQuantity },
        { headers: { authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Error updating quantity. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address!");
      return;
    }

    try {
      const res = await axios.post(
        `${api}/placeorders`,
        { selectedAddress, cartItems,total },
        { headers: { authorization: `Bearer ${token}` } }
      );
      console.log(res);
      alert("Order placed successfully");
      navigate("/orderplaced");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.product.price * cartItems.quantity;
  };

  const taxRate = 0.1; // 10% tax
  const subtotal = cartItems ? calculateSubtotal() : 0;
  const tax = subtotal * taxRate;
  const protectPromiseFee = 9;
  const total = subtotal + tax + protectPromiseFee;

  // Check if cartItems is null and render loading state
  if (!cartItems) return <div>Loading...</div>; // Show loading while fetching data

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Cart Section */}
        <div className="flex-1 bg-white p-6 shadow-md rounded-lg overflow-y-auto lg:min-h-[600px]">
          <h2 className="text-3xl font-bold mb-6">BUY NOW</h2>
          <div className="border-b pb-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center">
              <img
                src={cartItems.product.images[0]} // Assuming the product has an image
                alt="Product"
                className="w-32 h-32 sm:w-52 sm:h-28 border rounded-xl object-cover"
              />
              <div className="mt-4 sm:mt-0 sm:ml-10">
                <h3 className="text-lg text-gray-900">{cartItems.product.productName}</h3>
                <p className="text-gray-500">{cartItems.product.productDetails}</p>
                <p className="text-gray-900 font-semibold mt-1">₹{cartItems.product.price}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 sm:mt-5 font-semibold">
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={cartItems.quantity <= 1}
                  className={`px-2 py-1 rounded-md ${cartItems.quantity <= 1 ? "bg-gray-300 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                >
                  -
                </button>
                <span className="mx-4">{cartItems.quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>
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
                  value={address._id}
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

export default BuyNowPage;
