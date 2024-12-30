import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Api from '../../API/Api';

const Products = () => {
    const api=Api()
    const [products, setProducts] = useState([]);
    const {category}=useParams()

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // products
        const {data}=await axios.get(`${api}/getcatproducts/${category}`)
        setProducts(data)
    };

    // console.log(category);
    
  return (
    <>
    <div className="flex flex-wrap justify-center">
                    {products.map((prod) =><>
                        <Link  key={prod._id} >
                             <div className="w-full sm:w-48 md:w-56 lg:w-64 h-56 border border-gray-300 p-4 m-2 shadow-lg">
                                <img src={prod.images[0]} alt="Post" className="w-full h-5/6 object-cover border rounded-md" />
                                <div className='flex flex-wrap justify-between mt-2'>
                                <p className='text-center text-sm font-semibold '>{prod.productName}</p>
                                <p className='text-center text-sm font-semibold text-green-600 '>₹{prod.price}</p>
                                </div>
                             </div>
                         </Link>
                    </>)}
                </div>
    </>
  )
}

export default Products