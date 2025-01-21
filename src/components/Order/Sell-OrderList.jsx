import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../../API/Api";
import { useNavigate } from "react-router-dom";


const SellOrdersList = ({setUser,setProfile}) => {
  const api=Api()
  const token=localStorage.getItem('Token')
  const quantityData=localStorage.getItem('QuantityData')
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
        const {data}=await axios.get(`${api}/forconfirm`,{headers:{"authorization":`Bearer ${token}`}})
        console.log(data);
        setOrderlist(data.orders)
        setUser(data.user.username)
        if(data.user.profile){
          setProfile(data.user.profile)
        }
      }
      else{
        // navigate('/signin')
      }
    } catch (error) {
      console.log(error);
      // navigate('/signin')
      
    }
  }

  const handleAccept=async(id)=>{
    const res = await axios.post(
      `${api}/accept/${id}`,
      quantityData,
      {
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
    });
    console.log(res.data);
    alert(res.data.msg)
    fetchData()
  }

  const handleReject=async(id)=>{
    const res = await axios.post(`${api}/reject/${id}`,{}, {
      headers: {
        "authorization": `Bearer ${token}`,
      },
    });    
    console.log(res.data);
    alert(res.data.msg)
    navigate('/sell')
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
            key={order._id}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                <p className="text-sm text-gray-600">Date: {order.createdAt}</p>
                <p className="text-sm text-gray-600">Product Name: {order.product.productName}</p>
              </div>
              {order.confirm ? (
                <p className="text-md text-green-600 font-semibold">Confirmed</p>
              ) : (
                <div>
                  <button
                    className="py-2 px-4 border rounded-md font-semibold bg-green-700 text-green-100 text-sm hover:underline mr-2"
                    onClick={() => handleAccept(order._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="py-2 px-4 border rounded-md font-semibold bg-red-700 text-green-100 text-sm hover:underline"
                    onClick={() => handleReject(order._id)}
                  >
                    Reject
                  </button>
                </div>
              )}


            </div>
            <p className="text-sm font-semibold text-red-900 mt-2">Total: {order.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellOrdersList;
