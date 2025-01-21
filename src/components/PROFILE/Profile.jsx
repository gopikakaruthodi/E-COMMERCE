import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Api from '../../API/Api';
import { useNavigate, Link } from 'react-router-dom';
import { DotsVerticalIcon } from '@heroicons/react/solid'; // Heroicons for 3 dots
import { RiAccountCircleFill } from "react-icons/ri";
import { MdAccountTree } from "react-icons/md";

const Profile = ({setUser,setProfile}) => {
  const token = localStorage.getItem('Token');
  const navigate = useNavigate();
  const api = Api();
  const [currentView, setCurrentView] = useState('profile'); // Track current view (profile, address, add address)
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownStates, setDropdownStates] = useState([]); // Dropdown state for each address
  const [profilepic, setProfilepic] = useState(false); // Dropdown state for each address
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    profile:''
  });
  const [addressData, setAddressData] = useState([]);
  const [type, setType] = useState("");
  const [newAddress, setNewAddress] = useState({
    place: '',
    house: '',
    pincode: '',
  });

  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  useEffect(() => {
    fetchProfileData();
    fetchAddressData();
  }, []);

  const fetchProfileData = async () => {
   try {
    if (token) {
      const { data } = await axios.get(`${api}/displayprofile`, { headers: { "authorization": `Bearer ${token}` } });
      console.log(data);
      
      setProfileData(data.data);
      setType(data.data.accountType)
      setUser(data.user.username)
      if(data.user.profile){
        setProfile(data.user.profile)
      }
      if(data.user.profile)
        setProfilepic(true)
    } else {
      navigate('/signin');
    }
   } catch (error) {
    console.log(error);
    navigate('/signin');
    
   }
  };

  const fetchAddressData = async () => {
    const { data } = await axios.get(`${api}/getAddress`,{ headers: { "authorization": `Bearer ${token}` } });
    setAddressData(data.address);
    setDropdownStates(new Array(data.length).fill(false)); // Initialize dropdown states for each address
  };

  const handleClick = () => {
    { isEditing ? profilehandleSubmit() : setIsEditing(!isEditing) };
  };

  const addrhandleClick = () => {
    handleAddrSubmit();
  };

  const profilehandleSubmit = async () => {
    try {
      const { data } = await axios.put(`${api}/editProfile`, profileData, { headers: { "authorization": `Bearer ${token}` } });
      alert(data.msg);
      if(profileData.profile)
        setProfilepic(true)
      setIsEditing(false);

    } catch (error) {
      console.log(error);
    }
  };

  const handleAddrSubmit = async () => {
    const { data } = await axios.post(`${api}/address`, newAddress,{ headers: { "authorization": `Bearer ${token}` } });
    alert(data.msg);
    setNewAddress({
      place: '',
      house: '',
      pincode: '',
    });
    fetchAddressData(); // Fetch updated address list after adding new address
    setCurrentView('address');
  };

  const handleEdit = (index) => {
    setEditingAddressIndex(index); // Set the address index to be edited
    // Update newAddress with the current values of the address to be edited
    setNewAddress({
      place: addressData[index].place,
      house: addressData[index].house,
      pincode: addressData[index].pincode,
    });
  };

  const handleDelete = async(id,index) => {
    // console.log(id);
    // Add deletion logic here if needed
    if(confirm('Please confirm that you want to delete this address.')){
      try {
        const { data } = await axios.delete(`${api}/deleteAddress/${id}`);
        alert(data.msg);
        fetchAddressData()
      } catch (error) {
        console.log(error);
      }
    }
  };
console.log(type);

  const handleSave = async (id, index) => {
    const updatedAddress = { ...addressData[index], ...newAddress }; // Merge newAddress into the current address
    try {
      const { data } = await axios.put(`${api}/editAddress/${id}`, updatedAddress,{ headers: { "authorization": `Bearer ${token}` } });
      alert(data.msg);
      setEditingAddressIndex(null); // Stop editing
      fetchAddressData(); // Refresh the address data
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // setProfilepic(reader.result);
        setProfileData((pre) => ({...pre,[e.target.name]: reader.result}));

      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDropdown = (index) => {
    const updatedDropdownStates = [...dropdownStates];
    updatedDropdownStates[index] = !updatedDropdownStates[index];
    setDropdownStates(updatedDropdownStates);
  };

  const handleProfileChange = (e) => {
    setProfileData((pre) => ({...pre,[e.target.name]: e.target.value}));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full h-full bg-gray-100 font-sans px-10 py-10 flex justify-center flex-col md:flex-row ">
      <div className="w-full mr-2 shadow-lg md:w-1/4 p-6 bg-white  md:text-center md:text-center md:border-r-4 md:border-b-0">
        <div className='md:grid justify-center flex-wrap mt-10'>
          {profilepic?<img
            src={profileData.profile}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto md:mx-0 mb-4 object-cover"
          />:<img
            src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto md:mx-0 mb-4"
          />}
          <p className="text-xs text-gray-500">username</p>
          <p className="text-2xl font-semibold text-gray-800 mt-3">{profileData.username}</p>
        </div>
        <div className="space-y-4 mt-8">
          <table>
            <thead>
            <tr>
            <th className='px-4 py-3 '>
            <RiAccountCircleFill className='w-6 h-6' />
            </th>
            <th className='px-4 py-3 text-left'>
              <p className='text-gray-500 font-bold text-lg'>ACCOUNT DETAILS</p>
            </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td></td>
              <td className=''>
              <button
                  onClick={() => setCurrentView('profile')}
                  className="w-full text-left py-2  mx-5 text-gray-800  rounded-md hover:text-yellow-700 hover:bg-gray-100 "
                >
                  View Profile
                </button>
                <button
                  onClick={() => setCurrentView('address')}
                  className="w-full py-2 text-left mx-5 text-gray-800 rounded-md hover:text-yellow-700 hover:bg-gray-100"
                >
                  Manage Address
                </button>
               </td>
            </tr>
            <tr>
            <th className='px-4 py-3 '>
            <MdAccountTree className='w-6 h-6' />
            </th>
            <th className='px-4 py-3 text-left'>
              <p className='text-gray-500 font-bold text-lg'>MY STUFFS</p>
            </th>
            </tr>
            <tr>
              <td></td>
              <td className=''>
                <button
                  onClick={() => navigate('/orderslist')}
                  className="w-full py-2 text-left mx-5 text-gray-800 rounded-md hover:text-yellow-700 hover:bg-gray-100"
                >
                  My Orders
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full py-2 text-left mx-5 text-gray-800 rounded-md hover:text-yellow-700 hover:bg-gray-100"
                >
                  My Cart
                </button>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full py-2 text-left mx-5 text-gray-800 rounded-md hover:text-yellow-700 hover:bg-gray-100"
                >
                  My Wishlist
                </button>
              </td>
            </tr>
            </tbody>
          </table>
          
        </div>
      </div>

      <div className="w-full shadow-lg border-b md:w-2/3 p-6 bg-white ">
        {currentView === 'profile' ? (
          <div>
            {type==='Seller'?<Link to={'/sell'} className='float-right'>
              <button className='bg-yellow-600 text-white border font-semibold rounded-md px-2 shadow-md py-1 hover:bg-yellow-700'>SELL</button>
            </Link>:<></>}
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Profile Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
             {isEditing?<div>
                <label className="block text-gray-700">Profile</label>
                <input
                  type="file"
                  name="profile"
                  // value={profileData.profile}
                  onChange={handleAvatarChange}
                  disabled={!isEditing}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>:<></>}
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <button
                onClick={handleClick}
                className="w-1/6 bg-yellow-700 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        ) : currentView === 'address' ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Address</h2>
            {addressData.length === 0 ? ( 
              <>
               <div>
               <button
                   onClick={() => setCurrentView('addAddress')}
                   className="w-1/4 py-2  text-green-600 text-start text-lg font-semibold rounded-md  hover:text-green-500 "
                 >
                   +Add Address
                 </button>
               </div>
              <p className="text-gray-600">No addresses added yet.</p>
              </>
            ) : (
              <div className='w-3/4'>
              <div>
              <button
                  onClick={() => setCurrentView('addAddress')}
                  className="w-1/4 py-2 px-4 text-green-600 text-start text-lg font-semibold rounded-md mt-4 hover:text-green-500 "
                >
                  +Add Address
                </button>
              </div>
                {addressData.map((address, index) => (
                  <div key={index} className="bg-gray-50 p-4 mb-4 rounded-lg shadow-md">
                    <div className="relative">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <th className="text-left">Place: </th>
                            <td>
                              <input
                                type="text"
                                name="place"
                                value={editingAddressIndex === index ? newAddress.place : address.place} // Show either newAddress or the current address
                                onChange={handleAddressChange} // Update newAddress on change
                                disabled={editingAddressIndex !== index} // Allow editing only if this address is selected
                                className="w-5/6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th className="text-left">House: </th>
                            <td>
                              <input
                                type="text"
                                name="house"
                                value={editingAddressIndex === index ? newAddress.house : address.house} // Show either newAddress or the current address
                                onChange={handleAddressChange} // Update newAddress on change
                                disabled={editingAddressIndex !== index} // Allow editing only if this address is selected
                                className="w-5/6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th className="text-left">Pincode: </th>
                            <td>
                              <input
                                type="text"
                                name="pincode"
                                value={editingAddressIndex === index ? newAddress.pincode : address.pincode} // Show either newAddress or the current address
                                onChange={handleAddressChange} // Update newAddress on change
                                disabled={editingAddressIndex !== index} // Allow editing only if this address is selected
                                className="w-5/6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div
                        onClick={() => toggleDropdown(index)}
                        className="absolute right-0 top-0 mt-3 mr-3 cursor-pointer"
                      >
                        <DotsVerticalIcon className="w-6 h-6 text-gray-600" />
                      </div>

                      {dropdownStates[index] && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-md mt-2 w-32">
                          <ul className="space-y-2 py-2 text-gray-700 text-sm">
                            <li
                              className="px-4 py-2 cursor-pointer font-semibold text-blue-500 hover:bg-gray-100"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </li>
                            <li
                              className="px-4 py-2 cursor-pointer font-semibold text-green-500  hover:bg-gray-100"
                              onClick={() => handleDelete(address._id,index)}
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    {editingAddressIndex === index && (
                      <button
                        onClick={() => handleSave(address._id, index)} // Save changes for this address
                        className="w-1/4 py-2 px-4 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700"
                      >
                        Save
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
           
          </div>
        ) : currentView === 'addAddress' ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Address</h2>
            <div>
              <label className="block text-gray-700">Place</label>
              <input
                type="text"
                name="place"
                value={newAddress.place}
                onChange={handleAddressChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">House</label>
              <input
                type="text"
                name="house"
                value={newAddress.house}
                onChange={handleAddressChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={newAddress.pincode}
                onChange={handleAddressChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={addrhandleClick}
              className="w-1/4 py-2 px-4 bg-green-600 text-white rounded-md mt-4 hover:bg-green-700"
            >
              Add Address
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
