import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../../API/Api';


  const Home = ({setUser,setProfile}) => {
    const api=Api()
    const navigate=useNavigate()
    const token =localStorage.getItem('Token')
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 


    useEffect(()=>{
      fetchData()
     },[])

     const fetchData=async()=>{
      try {
        if(token){
          const {data}=await axios.get(`${api}/displayproducts`, { headers: { "authorization": `Bearer ${token}` } })
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
    //  console.log(products);
     
     const filteredProducts = products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
      <div>
        {/* search */}
      <div className="max-w-3xl m-3">
      <input
        type="search"
        placeholder="Search for products..."
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
        {/* Main Content */}
        <h2 className="text-2xl mt-4 ml-5 font-bold tracking-tight text-gray-900">Trending products</h2>
        <div className="grid grid-cols-1 mt-7 ml-10 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((prod)=><>
          <Link to={`/productfulldetails/${prod._id}`} key={prod._id} ><div
                    
                    className="w-5/6 border border-gray-300 rounded overflow-hidden shadow-sm hover:shadow-lg shadow-gray-400  transition-shadow duration-300"
                  >
                    <div className="h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img src={prod.images[0]} alt="image" className=" h-full w-full object-cover object-center group-hover:opacity-75" />
                    </div>
                    <div className="p-4 grid justify-center text-center">
                                   <p className="text-sm text-gray-500">{prod.category}</p>
                      <h3 className="text-lg font-semibold mb-2">{prod.productName}</h3>
                      <p className="mt-1 text-gray-900">₹{prod.price}</p>
                      <button className="w-full mt-4 py-2 border border-green-700 text-green-600 px-5 rounded hover:bg-gray-100 transition-colors">
                        View More
                      </button>
                    </div>
                  </div></Link> 
          </>)}
        </div>
      </div>
    );
  };


  export default Home

