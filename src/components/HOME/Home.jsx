import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../../API/Api';
import { option } from 'framer-motion/client';

const Home = ({ setUser, setProfile }) => {
  const api = Api();
  const navigate = useNavigate();
  const token = localStorage.getItem('Token');
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (token) {
        const { data } = await axios.get(`${api}/displayproducts`, { headers: { authorization: `Bearer ${token}` } });
        setProducts(data.products);
        setUser(data.user.username);
        if (data.user.profile) {
          setProfile(data.user.profile);
        }
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.log(error);
      navigate('/signin');
    }
  };

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const priceRanges = [
    "All Prices",
    "100-500",
    "500-1000",
    "1000-2000",
    "2000+",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
  
    let matchesPrice = true;
    if (selectedPriceRange !== "All Prices") {
      const [min, max] = selectedPriceRange.includes("+") 
        ? [parseInt(selectedPriceRange), Infinity] // For "2000+", set max to Infinity
        : selectedPriceRange.split("-").map(Number);
  
      matchesPrice = product.price >= min && product.price <= max;
    }
  
    return matchesCategory && matchesSearch && matchesPrice;
  });
  

  return (
    <div>
      {/* Search */}
      <div className="flex w-full">
        <input
          type="search"
          placeholder="Search for products..."
          className="w-1/2 h-12 p-3 m-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 mr-32"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Category Filter */}
        <div className="mb-4 w-1/2 mt-6 ">
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 w-3/4 text-md font-semibold text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
          >
            {categories.map((category, index) => (
              <option key={index} value={category} className="text-md font-semibold text-gray-600">
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="mb-4 w-1/2 mt-6
        ">
          <select
            id="price"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className="p-3 w-3/4 text-md font-semibold text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
          >
            {priceRanges.map((range, index) => (
              <option key={index} value={range} className="text-md font-semibold text-gray-600">
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <h2 className="text-2xl mt-4 ml-5 font-bold tracking-tight text-gray-900">Trending products</h2>
      <div className="grid grid-cols-1 mt-7 ml-10 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((prod) => (
          <Link to={`/productfulldetails/${prod._id}`} key={prod._id}>
            <div className="w-5/6 border border-gray-300 rounded overflow-hidden shadow-sm hover:shadow-lg shadow-gray-400 transition-shadow duration-300">
              <div className="h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                <img
                  src={prod.images[0]}
                  alt="image"
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="p-4 grid justify-center text-center">
                <p className="text-sm text-gray-500">{prod.category}</p>
                <h3 className="text-lg font-semibold mb-2">
                  {prod.productName.length > 24 ? `${prod.productName.slice(0, 24)}...` : prod.productName}
                </h3>
                <p className="mt-1 text-gray-900">₹{prod.price}</p>
                <button className="w-full mt-4 py-2 border border-green-700 text-green-600 px-5 rounded hover:bg-gray-100 transition-colors">
                  View More
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
