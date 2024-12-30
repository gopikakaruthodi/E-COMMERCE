import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Api from '../../API/Api';

const Sell = () => {
  const api = Api();
  const navigate = useNavigate();
  const token = localStorage.getItem('Token');
  const [compData, setCompData] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [proBool, setProBool] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (token) {
      try {
        const { data } = await axios.get(`${api}/getcompany`, {
          headers: { 'authorization': `Bearer ${token}` },
        });
        setCompData(data);
        data ? setProBool(true) : setProBool(false);

        // Fetch products
        const res = await axios.get(`${api}/getproducts`);
        setProducts(res.data);

        // Fetch categories
        const res1 = await axios.get(`${api}/getcategory`);
        const cat = res1.data.map((cat) => cat.category);
        setCategories(cat);
      } catch (error) {
        console.log(error);
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  };

  // Function to get the count of products by category
  const getCategoryCount = (category) => {
    // Filter products by category and return the count (length)
    return products.filter((product) => product.category === category).length;
  };

  return (
    <div className="flex flex-col md:flex-row pl-4 w-full h-[100vh] font-sans">
      {/* Left Section */}
      <div className="w-full md:w-[24%] h-full flex flex-col  border-b md:border-r-4 border-double border-black md:border-b-0">
        <div className="grid">
          <img
            src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            alt="pro pic"
            className="mt-4 w-40 h-40 rounded-full object-cover bg-cover"
          />
          <h2 className="text-yellow-900 text-2xl  mt-3 ">-{compData.name}-</h2>
        </div>
        <div className="flex flex-col items-start w-full mt-4">
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold mr-2">Company Name:</h5>
            <div className="text-md">{compData ? compData.name : '-'}</div>
          </div>
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold mr-2">Email:</h5>
            <div className="text-md">{compData ? compData.email : '-'}</div>
          </div>
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold mr-2">Phone:</h5>
            <div className="text-md">{proBool ? compData.phone : '-'}</div>
          </div>
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold mr-2">Place:</h5>
            <div className="text-md">{proBool ? compData.place : '-'}</div>
          </div>
        </div>
        <div className="w-full mt-4">
          <Link to="/editcompany">
            <button className="bg-yellow-700 text-white py-2 px-12 rounded-full mr-2 hover:bg-yellow-600 ">{proBool ? 'Edit' : 'Create'}</button>
          </Link>
          <button className="bg-gray-700  text-white py-2 px-10 rounded-full hover:bg-gray-600">Delete</button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[60%] mt-4 md:mt-2">
        <Link to="/addproduct">
          <button className="bg-white text-yellow-600 py-2 px-4 ml-2 text-lg mb-4 rounded-md font-semibold ">+Add Products</button>
        </Link>

        <div className="grid grid-cols-1 ml-5 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {categories.map((category) => (
            <Link to={`/products/${category}`} key={category}>
              <div className="bg-yellow-50 rounded-3xl shadow-xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{category}</h3>
                {/* Get the count for each category using the new function */}
                <p className="text-md text-gray-600">{getCategoryCount(category)} Items</p>
                <button className="bg-yellow-700 text-white py-2 px-6 mt-4 rounded-full hover:bg-yellow-600 transition duration-300">
                  View More
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sell;
