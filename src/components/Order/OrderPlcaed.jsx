import React from "react";
import { CheckCircleIcon, TruckIcon, ShoppingBagIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const OrderPlaced = () => {
 const navigate=useNavigate()
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <motion.div
        className="bg-white p-6 md:p-10 rounded-lg shadow-lg max-w-xl text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Success Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, bounce: 0.5 }}
        >
          <CheckCircleIcon className="h-20 w-20 text-green-500" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us. Your order has been placed and will be delivered soon.
        </p>

        {/* Order Details */}
        <motion.div
          className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Order Number</span>
            <span className="font-semibold text-gray-800">#123456789</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Estimated Delivery</span>
            <span className="font-semibold text-gray-800">Jan 20, 2025</span>
          </div>
        </motion.div>

        {/* Tracking Section */}
        <motion.div
          className="bg-green-50 p-4 rounded-lg mb-6 flex items-center space-x-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <TruckIcon className="h-8 w-8 text-green-500" />
          <div>
            <p className="font-semibold text-green-700">On the way!</p>
            <p className="text-sm text-green-600">
              Your order is being prepared and will be shipped soon.
            </p>
          </div>
        </motion.div>

        {/* Continue Shopping Button */}
        <Link to={'/'}>
        <motion.button
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.05 }}
          onClick={navigate('/')}
        >
          <ShoppingBagIcon className="h-5 w-5" />
          <span>Continue Shopping</span>
        </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderPlaced;
