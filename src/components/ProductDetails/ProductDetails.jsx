import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../../API/Api";
import { useNavigate, useParams,Link } from "react-router-dom";

const ProductDetails = ({setUser,setProfile}) => {
  const token=localStorage.getItem('Token')
    const navigate=useNavigate()
    const {_id}=useParams()
  const api=Api()
  const [selectedImage, setSelectedImage] = useState(''); // Default image
  const [images,setImages] =useState( [])
  const [product,setProducts]=useState({})
  const [sizes,setSizes]=useState([])

  useEffect(()=>{
    fecthData()
  },[])

  const fecthData=async()=>{
    try {
      if(token){
        const {data}=await axios.get(`${api}/getproduct/${_id}`,{headers:{"authorization":`Bearer ${token}`}})
      console.log(data);
      setProducts(data.products)
      // console.log(data.products);
      setImages(data.products.images)
      setSelectedImage(data.products.images[0])
      setSizes(data.products.sizes)
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
  const handleDelete=async(_id)=>{
    const {data}=await axios.delete(`${api}/deleteproduct/${_id}`)
    console.log(data);
    alert(data.msg)
    navigate('/sell')
  }
  console.log(images);
  

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Images */}
        <div className="flex flex-col">
          <div className="w-full h-96 bg-gray-100 flex justify-center items-center overflow-hidden">
            <img
              src={selectedImage}
              alt="Selected Product"
              className="h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex space-x-4 mt-4 justify-center">
            {images.map((img, index) => (
              <div
                key={index}
                onMouseEnter={() => setSelectedImage(img)} // Temporarily changes the main image on hover
                onMouseLeave={() => setSelectedImage(images[0])} // Reverts back to the default image on hover out
                className="w-20 h-20 bg-gray-200 cursor-pointer border border-gray-300 hover:border-gray-500"
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Right Section: Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">{product.productName}</h1>
          <p className="text-xl text-red-500 font-bold">
          ₹800 <span className="line-through text-gray-500 text-base">₹{product.price}</span>
          </p>

          <div>
            <h3 className="text-lg font-medium">Select Size:</h3>
            <div className="flex space-x-4 mt-2">
              {sizes.map((size,index) => (
                <button
                  key={index}
                  className="px-4 py-2 border border-gray-300 hover:border-gray-500 hover:bg-gray-100 rounded"
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            <Link to={`/editproduct/${product._id}`} className="flex-1">
            <button  className=" py-3 px-24 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-500 transition-colors">
              EDIT
            </button>
            </Link>
            <button onClick={()=>handleDelete(product._id)} className="flex-1 py-3 bg-gray-300 text-gray-800 font-bold rounded hover:bg-gray-300 transition-colors">
              DELETE
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium">Product Details:</h3>
            <p className="text-gray-600">
              {product.productDetails}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
