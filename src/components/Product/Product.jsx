import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Api from '../../API/Api';

const Products = () => {
  const token=localStorage.getItem('Token')
  const [searchQuery, setSearchQuery] = useState("");
  const api=Api()
  const [products, setProducts] = useState([]);
  const navigate=useNavigate()
  const {category}=useParams();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
       try {
         if(token){
          // products
         const {data}=await axios.get(`${api}/getcatproducts/${category}`)
         // console.log(data);
         setProducts(data)
         }
         else{
          navigate('/signin')
         }
       } catch (error) {
        console.log(error);
        navigate('/signin')
        
       }
    };


  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().startsWith(searchQuery.toLowerCase())
  );
  
  console.log(filteredProducts);
  

  return (
    <>
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
    {/* Search Bar */}
    <div className="max-w-3xl mb-6">
      <input
        type="search"
        placeholder="Search for products..."
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((prod) => (
        <Link to={`/productdetails/${prod._id}`} ><div
          key={prod.id}
          className="border border-gray-300 rounded overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={prod.images[0]}
            alt={prod.productName}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{prod.productName}</h3>
            <p className="text-green-600 font-bold">${prod.price}</p>
            <button className="w-full mt-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition-colors">
              View More
            </button>
          </div>
        </div></Link> 
      ))}
    </div>

    {filteredProducts.length === 0 && (
      <p className="text-center text-gray-500 mt-6">No products found.</p>
    )}
  </div>
  </>
  )
}

export default Products;