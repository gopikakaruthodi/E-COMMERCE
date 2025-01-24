import React, { useEffect, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { IoHeartSharp } from "react-icons/io5";



import axios from 'axios';
import Api from '../../API/Api';


const Navbar = ({user,profile}) => {
  const token=localStorage.getItem('Token')
  const api=Api()
  const navigate=useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu toggle
  // const [profile, setProfile] = useState('https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'); // For mobile menu toggle


  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  useEffect(()=>{
    fetchData()
  },[isMenuOpen,isDropdownOpen])
  const fetchData= async()=>{
    const { data } = await axios.get(`${api}/displaycart`, {
      headers: { authorization: `Bearer ${token}` },
    })
    setCartCount(data.cart.length)
    // setProfile(data.profile)
  }

  const logout=()=>{
    localStorage.removeItem('token')
    navigate('/signin')
 }


  return (
    <nav className="bg-green-900  p-3 shadow-md">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      {/* Logo/Title */}
      <Link to="/">
        <div className="text-white font-bold text-2xl">
          <p>WELCOME TO TRENDY</p>
        </div>
      </Link> 

      {/* Desktop Profile Dropdown */}
      <div className='flex justify-evenly items-center'>
        {/* Cart Icon with Count */}
      <div className="relative px-5">
        <Link to="/cart">
          <FaShoppingCart className="text-2xl text-white" />
        </Link>
        {cartCount > 0 && (
          <span className="absolute -top-2 right-3 bg-green-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </div>
      <div className="hidden md:block relative px-5">
        
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-white"
        >
          <img
            src={profile}
            alt="Profile"
            className="rounded-full w-10 h-10 object-cover"
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-44 bg-gray-100 rounded-xl shadow-lg z-50"
            onClick={closeDropdown}
          >
            <ul className="py-2 text-center">
              <li>
                <Link
                  to="/profile"
                  className="flex items-center justify-left  text-yellow-800 px-4 py-2 font-bold hover:text-yellow-700"
                >
                  <span><CgProfile className='w-6 h-6 pr-2' /></span>
                  <span className=''> My Profile</span>
                </Link>
              </li>
              <hr className='text-gray-900 ' />
              <li>
              <Link
                  to="/wishlist"
                  className="flex items-center justify-left  text-yellow-800 px-4 py-2 font-bold hover:text-yellow-700"
                >
                  <span><IoHeartSharp className='w-6 h-6 pr-2' /></span>
                  <span className=''> My Wishlist</span>
                </Link>
              </li>
              <hr className='text-gray-900 ' />
              <li>
                <button
                  className="block flex items-center justify-left w-full text-center px-4 py-2 font-bold text-yellow-800 hover:text-yellow-700"
                  onClick={logout}
                >
                <span><TbLogout className='w-6 h-6 pr-2'  /></span>
                <span >Logout</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    {/* Mobile Menu Dropdown */}
    {isMenuOpen && (
      <div className="md:hidden bg-white shadow-md mt-2 rounded-md">
        <ul className="py-2">
          <li>
          <Link
                  to="/profile"
                  className="flex items-center justify-left  text-yellow-800 px-4 py-2 font-bold hover:text-yellow-700"
                >
                  <span><CgProfile className='w-6 h-6 pr-2' /></span>
                  <span className=''> My Profile</span>
              </Link>
          </li>
          <hr className='text-gray-900 ' />
              <li>
              <Link
                  to="/wishlist"
                  className="flex items-center justify-left  text-yellow-800 px-4 py-2 font-bold hover:text-yellow-700"
                >
                  <span><IoHeartSharp className='w-6 h-6 pr-2' /></span>
                  <span className=''> My Wishlist</span>
                </Link>
              </li>
              <hr className='text-gray-900 ' />
              <li>
                <button
                  className="block flex items-center justify-left w-full text-center px-4 py-2 font-bold text-yellow-800 hover:text-yellow-700"
                  onClick={logout}
                >
                <span><TbLogout className='w-6 h-6 pr-2'  /></span>
                <span >Logout</span>
                </button>
              </li>
        </ul>
      </div>
    )}
  </nav>
  );
};

export default Navbar
