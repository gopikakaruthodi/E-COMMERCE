  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';

  const Navbar = () => {
    const navigate=useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu toggle

    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };

    const closeDropdown = () => {
      setIsDropdownOpen(false);
    };

    const toggleMobileMenu = () => {
      setIsMenuOpen((prev) => !prev);
    };

    const logout=()=>{
      localStorage.removeItem('token')
      navigate('/signin')
   }

    return (
      <nav className="bg-yellow-700 p-3 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo/Title */}
          <div className="text-white font-bold text-2xl">
            Home Page
          </div>

          {/* Desktop Profile Dropdown */}
          <div className="hidden md:block relative ">
            <button 
              onClick={toggleDropdown} 
              className="flex items-center space-x-2 text-white"
            >
              <img 
                src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" 
                alt="Profile" 
                className="rounded-full w-10 h-10"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2  w-36 bg-black rounded-xl shadow-lg z-50  hover:bg-black text-white" 
                onClick={closeDropdown}
              >
                <ul className="py-2 text-center px-3">
                  <li>
                    <Link to={'/profile'} className="block px-4 py-2 font-bold text-yellow-500 hover:text-white">Profile</Link>
                    {/* <a href="./" >Profile</a> */}
                  </li>
                  <hr />
                  <li>
                    <p className="block px-4 py-2 font-bold text-yellow-500 hover:text-white" onClick={logout} >Logout</p>
                  </li>
                </ul>
              </div>
            )}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md mt-2 rounded-md">
            <ul className="py-2">
              <li>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    );
  };

  const Home = () => {
    return (
      <div>
        <Navbar />
        {/* Main Content */}
        <div className="py-16 px-8">
          {/* <h1 className="text-3xl font-semibold text-center text-gray-800">Welcome to the Home Page</h1> */}
          {/* <p className="mt-4 text-center text-gray-600">This is a sample homepage with a React navbar using Tailwind CSS. It is responsive to all screen sizes.</p> */}
        </div>
      </div>
    );
  };


  export default Home