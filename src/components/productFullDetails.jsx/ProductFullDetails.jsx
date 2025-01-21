import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../../API/Api";
import { useNavigate, useParams,Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";


const ProductFullDetails = ({setUser,setProfile}) => {
    const navigate=useNavigate()
    const {_id}=useParams()
  const token=localStorage.getItem('Token')
  const api=Api()
  const [selectedImage, setSelectedImage] = useState(''); // Default image
  const [images,setImages] =useState( [])
  const [product,setProduct]=useState({})
  const [sizes,setSizes]=useState([])
  const [selectedSize, setSelectedSize] = useState(null);
  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [isOnCart, setIsOnCart] = useState(false);
  

  useEffect(()=>{
    fecthData()
  },[])

  const fecthData=async()=>{
    try {
      if(token){
        const {data}=await axios.get(`${api}/getproduct/${_id}`,{headers: { "authorization":` Bearer ${token}`},})
      // console.log(data);
      console.log(data.isOnWishlist);
      setProduct(data.products)
      setImages(data.products.images)
      setSelectedImage(data.products.images[0])
      setSizes(data.products.sizes)
      data.isOnWishlist?setIsOnWishlist(true):setIsOnWishlist(false)
      data.isOnCart?setIsOnCart(true):setIsOnCart(false);

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
 
  const toggleWishlist = async (id) => {
    try {
      console.log(id); 
      let res;
      if (isOnWishlist) {
        // Use DELETE for removing from wishlist
        const endpoint = `${api}/removewishlist/${id}`;
        res = await axios.delete(endpoint, {headers: { "authorization":` Bearer ${token}`},});
      } else {
        
        // Use POST for adding to wishlist
        const endpoint = `${api}/addtowishlist`;
        res = await axios.post(endpoint,{ id },{ headers: { "authorization": `Bearer ${token}` } });
      }
  
      if (res.status === 200) {
        setIsOnWishlist(!isOnWishlist);
        alert(
          isOnWishlist
            ? "Removed from wishlist"
            : "Added to wishlist"
        );
      } else {
        alert("Operation failed");
      }
    } catch (error) {
      alert(error.response.data.msg)
    }
  }
const addToCart=async()=>{
try {
  if (!selectedSize) {
    alert("Please select a size before adding to cart.");
    return;
  }
  const {data}=await axios.post(`${api}/addtocart`,{product,selectedSize},{headers:{"authorization":`Bearer ${token}`}})
  // console.log(data);
  alert(data.msg)
  fecthData()
  

} catch (error) {
  console.log(error);
  
  // alert(error.response.data.msg)
}

}
const handleBuy=async()=>{
try {
  if (!selectedSize) {
    alert("Please select a size before adding to cart.");
    return;
  }
  const {data}=await axios.post(`${api}/addtocart`,{product,selectedSize,},{headers:{"authorization":`Bearer ${token}`}})
  // console.log(data);
  navigate(`/buynow/${_id}`)
  
} catch (error) {
  console.log(error);
  
  // alert(error.response.data.msg)
}

}
console.log(isOnCart);


  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Images */}
        <div className="h-screen flex flex-col items-center">
          <div className="w-full h-3/5 bg-gray-100">
            <img
              src={selectedImage}
              alt="Selected Product"
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </div>
          <div className="flex space-x-4 mt-4 justify-center">
            {images.map((img, index) => (
              <div
                key={index}
                onMouseEnter={() => setSelectedImage(img)} // Temporarily changes the main image on hover
                // onMouseOver={()=>setSelectedImage(images[0])}
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
                  onClick={() => setSelectedSize(size.size)}
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size.size
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300 hover:border-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mt-4 items-center"> 
          {isOnWishlist ? (
                  <AiFillHeart
                    className="text-red-600 text-4xl cursor-pointer  rounded-md"
                    onClick={()=>toggleWishlist(product._id)}
                  />
                ) : (
                  <AiOutlineHeart
                    className="text-4xl text-gray-400 hover:text-red-600  transition-colors cursor-pointer"
                    onClick={()=>toggleWishlist(product._id)}
                  />
                )}

            <button onClick={handleBuy}  className="flex-1 px-20 py-3  bg-yellow-600 text-white font-bold rounded hover:bg-yellow-500 transition-colors">
              BUY NOW 
            </button>

            {isOnCart?<Link to={'/cart'} className="flex-1 py-3 px-16 bg-gray-300 text-center text-gray-800 font-bold rounded hover:bg-gray-300 transition-colors"><button className="flex-1 bg-gray-300 text-gray-800 font-bold rounded hover:bg-gray-300 transition-colors">
              GO TO CART
            </button></Link>:<button onClick={addToCart} className="flex-1 px-16 py-3 bg-gray-300 text-gray-800 font-bold rounded hover:bg-gray-300 transition-colors">
              ADD TO CART
            </button>}
          </div>

          <div>
            <h3 className="text-lg font-medium">Product Details:</h3>
            <p className="text-gray-600">
              {product.productDetails}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Category:</h3>
            <p className="text-gray-600">{product.category}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Sold By:</h3>
            <p className="text-gray-600">Wind It Store, Stillwater</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFullDetails;
