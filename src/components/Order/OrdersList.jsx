import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../../API/Api";
import { useNavigate } from "react-router-dom";


const OrdersList = ({setUser,setProfile}) => {
  const api=Api()
  const token=localStorage.getItem('Token')
  const navigate=useNavigate()
  const [orderlist,setOrderlist]=useState([])
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(()=>{
    fetchData()
  },[])

  const fetchData= async()=>{
    try {
      if(token){
        const {data}=await axios.get(`${api}/getorders`,{headers:{"authorization":`Bearer ${token}`}})
        console.log(data);
        setOrderlist(data.orders)
        setUser(data.user.username)
        if(data.user.profile){
          setProfile(data.user.profile)
        }
      }
      else{
        navigate('/signin')
      }
    } catch (error) {
      console.log(error);
      navigate('/signin')
      
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YOUR ORDERS</h1>
      {orderlist.length === 0 && (
      <p className="text-center text-gray-500 mt-6">No Orders Placed.</p>
      )}
      <div className="space-y-4">
        {orderlist.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                <p className="text-sm text-gray-600">Date: {order.createdAt}</p>
              </div>
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => {navigate(`/productFullDetails/${order.product._id}`)}}
              >
                {expandedOrder === order._id ? "Hide Details" : "View Details"}
              </button>
            </div>
            <p className="text-green-700 mt-1">Status: pending</p>
            <p className="text-red-900 mt-2">Total: {order.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
  // {expandedOrder === order._id && (
  //   <div className="mt-4 border-t pt-2">
  //     <h3 className="text-md font-medium">Items:</h3>
  //     <ul className="space-y-2 mt-2">
  //       {order.items.map((item, index) => (
  //         <li
  //           key={index}
  //           className="flex justify-between text-sm text-gray-700"
  //         >
  //           <span>
  //             {item.qty}x {item.name}
  //           </span>
  //           <span>{item.price}</span>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // )}
