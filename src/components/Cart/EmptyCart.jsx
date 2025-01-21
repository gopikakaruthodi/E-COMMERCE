import React from "react";
import { ShoppingCartIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
    const navigate=useNavigate()
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Cart Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, bounce: 0.5 }}
        >
          <ShoppingCartIcon className="h-20 w-20 text-gray-300" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your Cart is Empty
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-gray-600 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          It seems like you haven’t added anything to your cart yet. Start shopping and fill it up!
        </motion.p>

        {/* Animated Symbol */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ y: -20, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5, bounce: 0.5 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1160/1160042.png"
            alt="Empty Cart Illustration"
            className="w-36 h-36"
          />
        </motion.div>

        {/* Back to Shop Button */}
        <motion.button
          onClick={() =>{navigate('/')}}
          className="flex items-center justify-center space-x-2  text-blue-600 px-6 py-3 rounded-lg  hover:transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Shopping</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
