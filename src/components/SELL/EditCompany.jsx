import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Api from '../../API/Api'
import { ToastContainer, toast } from 'react-toastify';


const EditComapany = () => {
  const token = localStorage.getItem("Token")
  const navigate = useNavigate()
  const api=Api()

  const [updateData, setUpdateData] = useState({
    name:'',email:'',phone:'',place:'',profile:''
  })
  const [proBool, setProBool] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      if(token){
        const {data} = await axios.get(`${api}/getcompany`, { headers: { "authorization": `Bearer ${token}` } })
        console.log(data);
        data? setProBool(true) : setProBool(false)
        setUpdateData(data)
      }
      else{
        navigate('/signin')
      }
    } catch (error) {
      console.log(error);
      navigate('/signin')
      
    }
  }

  const handleChange = (e) => {
    setUpdateData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // setProfilepic(reader.result);
        setUpdateData((pre) => ({...pre,[e.target.name]: reader.result}));

      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post(`${api}/editcompany`, updateData, { headers: { "authorization": `Bearer ${token}` } })
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
                   setTimeout(()=>{
                       navigate('/signin')
                   },3000)
    } catch (error) {
      console.log(error)
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
  }
  
  console.log(updateData);
  console.log(updateData.profile);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 lg:w-1/3">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Information</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-bold mb-2">Company Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={updateData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={updateData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="asd@gmail.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-bold mb-2">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={updateData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            //   placeholder="Edit here..."
            />
          </div>
          <div className="mb-4">
            <label htmlFor="place" className="block text-sm font-bold mb-2">Place:</label>
            <input
              type="text"
              id="place"
              name="place"
              value={updateData.place}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            //   placeholder="Edit here..."
            />
          </div>
          <div>
                <label className="block text-sm font-bold mb-2">Profile</label>
                <input
                  type="file"
                  name="profile"
                  // value={profileData.profile}
                  onChange={handleProfileChange}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
            </div>

          <button
            type="submit"
            className="w-full p-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSubmit}
          >
            {proBool ? 'Edit' : 'Create'}
          </button>
          <ToastContainer/>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Please ensure all information is correct.
        </div>
      </div>
    </div>
  )
}

export default EditComapany
