import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Api from '../../API/Api';


const Wishlist = ({setUser,setProfile}) => {
    const api=Api()
    const token =localStorage.getItem('Token')
    const [products, setProducts] = useState([]); 


    useEffect(()=>{
      fetchData()
     },[])

     const fetchData=async()=>{
      try {
        if(token){
          const {data}=await axios.get(`${api}/displaywish`, { headers: { "authorization": `Bearer ${token}` } })
          // console.log(data);
          setProducts(data.products)
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
     
      console.log(products);
      
    
      const removeFromWishlist = async(id) => {
        const {data}=await axios.delete(`${api}/removewishlist/${id}`, { headers: { "authorization": `Bearer ${token}` } })
        alert(data.msg)
        fetchData()
      };

  return (
    <>    
       <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((item) => (
            <Link to={`/productFullDetails/${item._id}`} key={item._id}>
              <div
              
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src={item.images[0]}
                  alt={item.productName}
                  className="w-32 h-32 object-cover mb-4"
                />
                <h2 className="text-lg font-semibold">{item.productName}</h2>
                <p className="text-gray-500 mb-4">${item.price.toFixed(2)}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded hover:border-red-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => navigate(`/productFullDetails/${item._id}`)}
                    className="px-4 py-2 border border-blue-500 text-blue-500  rounded hover:border-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </>

  )
}

export default Wishlist