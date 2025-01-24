import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Api from '../../API/Api'
import { ToastContainer, toast } from 'react-toastify';




const Signup = () => {
    const api=Api()
    const navigate=useNavigate()
    const [userData,setuserData]=useState({
        username:"",email:"",phone:"",password:"",cpassword:"",accountType:""
    })
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');   
    const [phoneError, setPhoneError] = useState('');   
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\d{10}$/;


    const handleChange=(e)=>{
        setuserData((pre)=>({...pre,[e.target.name]:e.target.value}))
    }

    const validatePassword = (value) => {
        if (!passwordRegex.test(value)) {
            setPasswordError(
            'Password must be 8-16 characters long, include uppercase, lowercase, number, and special character.'
          );
        } else {
            setPasswordError('');
        }
      };
    
      const handlePasswordChange = (e) => {
        const value = e.target.value;
        setuserData((pre)=>({...pre,[e.target.name]:e.target.value}))
        validatePassword(value);
      };
    
      const validateEmail = (value) => {
        if (!emailRegex.test(value)) {
          setEmailError('Invalid email format.');
        } else {
          setEmailError('');
        }
      };
    
      const handleEmailChange = (e) => {
        const value = e.target.value;
        setuserData((pre)=>({...pre,[e.target.name]:e.target.value}))
        validateEmail(value);
      };

      function validatePhoneNumber(phoneNumber) {

        if (!phoneRegex.test(phoneNumber)) {
            setPhoneError(
            'Phone number must be 10 digits'
          );
        } else {
            setPhoneError('');
        }
      }

      const handlePhoneChange = (e) => {
        const value = e.target.value;
        setuserData((pre)=>({...pre,[e.target.name]:e.target.value}))
        validatePhoneNumber(value);
      };
console.log(phoneError);

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const {data}=await axios.post(`${api}/signup`,userData)
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
            navigate('/')
           },3000)
            // alert(data.msg)
            
        } catch (error) {
            console.log(error);
            toast.error(`${error.response.data.msg}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
            alert(error.response.data.msg)
            
        }
    }
    // console.log(userData);
    
  return (
    <>
            <section className="bg-gray-50 ">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 leading-tight text-black sm:text-4xl lg:text-5xl">Create free account</h2>
                    {/* <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">You can create a free Celebration account in 2 minutes</p> */}
                </div>

                <div className="relative max-w-md mx-auto">
                    <div className="overflow-hidden bg-white rounded-md shadow-md">
                        <div className="px-4 py-6 sm:px-8 sm:py-7">
                            <form action="#" method="POST">
                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="" className="text-base font-medium text-gray-900"> USERNAME </label>
                                        <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>

                                            <input
                                                type="text"
                                                name="username"
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="" className="text-base font-medium text-gray-900"> EMAIL </label>
                                        <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>

                                            <input
                                                type="email"
                                                name="email"
                                                onChange={handleEmailChange}
                                                placeholder="Enter email to get started"
                                                className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                            />
                                        </div>
                                        {emailError && <p style={{ color: 'red',fontSize:'13px' }}>{emailError}</p>}
                                        </div>

                                    <div>
                                        <label htmlFor="" className="text-base font-medium text-gray-900"> PHONE </label>
                                        <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                {/* <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg> */}
                                            </div>

                                            <input
                                                type="text"
                                                name="phone"
                                                onChange={handlePhoneChange}
                                                placeholder=""
                                                className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                            />
                                        </div>
                                        {phoneError && <p style={{ color: 'red',fontSize:'13px' }}>{phoneError}</p>}
                                    </div>

                                    <div className='w-full flex justify-between'>
                                    <div>
                                        <label htmlFor="" className="text-base font-medium text-gray-900 "> Password </label>
                                        <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600 ">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                                                    />
                                                </svg>
                                            </div>

                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                onChange={handlePasswordChange}
                                                placeholder="Enter your password"
                                                className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                            />

                                        </div>
                                        {passwordError && <p style={{ color: 'red' , fontSize:'10px' , width:'200px' }}>{passwordError}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-base font-medium text-gray-900"> Confirm Password </label>
                                        <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                                                    />
                                                </svg>
                                            </div>

                                            <input
                                                type="password"
                                                name="cpassword"
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                            />
                                        </div>
                                    </div>
                                    </div>

                                    <div>
                                        <label htmlFor="account-type" className="text-base font-medium text-gray-900">Account Type</label>
                                        <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            </div>

                                            <select
                                            id="account-type"
                                            name="accountType"
                                            onChange={handleChange}
                                            className="block w-full py-4 pl-10 pr-4 text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                            >
                                            <option value="Seller">Seller</option>
                                            <option value="Buyer">Buyer</option>
                                            </select>
                                        </div>
                                        </div>

                                        <div className="flex items-center">
                                            <input type="checkbox" name="agree" onChange={handleChange}  className="w-5 h-5 text-green-500 bg-white border-gray-200 rounded" defaultChecked />

                                            <label htmlFor="agree" className="ml-3 text-sm font-medium text-gray-500">
                                                I agree to Postcraft’s <a href="#" title="" className="text-blue-600 hover:text-blue-700 hover:underline">Terms of Service</a> and <a href="#" title="" className="text-blue-600 hover:text-blue-700 hover:underline">Privacy Policy</a>
                                            </label>
                                    </div>

                                    <div>
                                        <button type="submit" onClick={handleSubmit} className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-yellow-600 border border-transparent rounded-md focus:outline-none hover:bg-yellow-700 focus:bg-yellow-700">
                                            Create Account
                                        </button>
                                        <ToastContainer />
                                    </div>

                                    {/* <div className="text-center">
                                        <p className="text-base text-gray-600">Already have an account? <a href="#" title="" className="font-medium text-orange-500 transition-all duration-200 hover:text-orange-600 hover:underline">Login here</a></p>
                                    </div> */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </>
  )
}

export default Signup