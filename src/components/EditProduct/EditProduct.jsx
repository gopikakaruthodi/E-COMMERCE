import axios from "axios";
import { useEffect, useState } from "react";
import Api from "../../API/Api";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


function EditProduct() {
    const{_id}=useParams()
    const navigate=useNavigate()
    const token=localStorage.getItem('Token')
  const api=Api()
  const [sizes, setSizes] = useState([{ size: "", quantity: "" }]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // Initial categories
  const [newCategory, setNewCategory] = useState(""); // State to store new category input
  const [showCategoryInput, setShowCategoryInput] = useState(false); // State to toggle category input visibility
  const [images, setImages] = useState([]); // State to toggle category input visibility
  const [product, setProduct] = useState({}); // State to toggle category input visibility


  const handleAddSize = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };


  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      console.log({ productName, price, category, sizes,images });
      const {data}=await axios.put(`${api}/editproduct/${_id}`,{productName, price, category, sizes,images})
      console.log(data);
      toast.success(`${data.msg}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            
            // alert(data.msg)
            setTimeout(()=>{
            navigate('/sell')
            },3000)
      // alert(data.msg)
      // navigate('/sell')
    } catch (error) {
      toast.error(`${error.response.data.msg}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    }
  };
  console.log({ productName, price, category, sizes,images});

useEffect(()=>{
    fetchDatas()
},[])
const fetchDatas=async()=>{
    const {data}=await axios.get(`${api}/getcategory`)
    // console.log(data);
    const cat=data.map(cat=>cat.category)
    setCategories(cat)

    // display edit details
    const res=await axios.get(`${api}/getproduct/${_id}`,{headers:{'authorization':`Bearer ${token}`}})
    setProduct(res.data.products)
    setPrice(res.data.products.price)
    setCategory(res.data.products.category)
    setSizes(res.data.products.sizes)
    setProductName(res.data.products.productName)
    setImages(res.data.products.images)
    // setSizes(res.data.sizes)
    console.log(res.data);
}

// product image

// Handle file upload and update images
const handleFile = async (e) => {
  const files = Object.values(e.target.files); // Get uploaded files
  console.log(files);

  // Clear current images and add the new ones
  const newImages = await Promise.all(
    files.map(async (file) => {
      const photo = await convertToBase64(file); // Convert to Base64
      return photo;
    })
  );

  setImages(newImages); // Replace current images with new ones
};

// Convert file to Base64
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result); // Resolve with Base64 data
    };
    fileReader.onerror = (error) => {
      reject(error); // Reject on error
    };
  });
}

console.log(_id);


  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md font-serif">
      <h2 className="text-3xl font-bold text-center mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="product-name">
            Product Name:   
          </label>
          <input
            type="text"
            id="product-name"
            name="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="price">
            Price:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div >
        <label className="block text-gray-700 mb-2">Photo:</label>
        <div className="flex flex-wrap">
        <input
            type="file"
            onChange={handleFile}
            accept="image/*"
            multiple
            className="mt-2 block w-1/2 text-sm text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <img
            src=''
            alt="Profile"
            className="mt-3 w-20 h-20 object-cover rounded-md"
        />
        </div>
        </div>

        
        {/* Category Dropdown with Add Button */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Category:
          </label>
          <div className="flex items-center gap-2">
            <select
              id="category"
              value={product.category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
               {/* <option>{product.category}</option> */}
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {/* <button
              type="button"
              onClick={() => setShowCategoryInput(true)}
              className="px-5 py-1 bg-yellow-500 text-white rounded"
            >
              +
            </button> */}
          </div>

          {/* New Category Input */}
          {/* {showCategoryInput && (
            <div className="mt-4">
              <input
                type="text"
                value={newCategory}
                onChange={handleNewCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter new category"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Add Category
              </button>
            </div>
          )} */}
        </div>

        {/* Sizes and Quantities */}
        <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="price">
            Sizes:
          </label>
          {sizes.map((size, index) => (
            <div key={index} className="flex gap-4 mb-3">
              <input
                type="text"
                placeholder="Size"
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={size.quantity}
                onChange={(e) =>
                  handleSizeChange(index, "quantity", e.target.value)
                }
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSize}
            className="w-full py-2 px-4 bg-yellow-600 text-white rounded-md mt-4"
          >
            + Add Size
          </button>
        </div>


        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-500 text-white rounded-md"
          >
            Update Product
          </button>
          <ToastContainer/>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;