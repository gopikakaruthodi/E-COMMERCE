import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Api from '../../API/Api';

const Password = () => {
  const api = Api();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/;
  const emailRegex = /^\S+@\S+\.\S+$/;

  useEffect(() => {
    // Enable button if all fields are valid
    if (
      password === confirmPassword &&
      password.length > 0 &&
      !passwordError &&
      !emailError
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [password, confirmPassword, passwordError, emailError]);

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
    setPassword(value);
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
    setEmail(value);
    validateEmail(value);
  };

  const changePassword = async () => {
    try {
      const { data } = await axios.put(`${api}/changepassword`, {
        email,
        password,
        cpassword: confirmPassword,
      });
      alert(data.msg);
      navigate('/signin');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6">Change Password</h2>
        <form id="forms" onSubmit={(e) => e.preventDefault()}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {emailError && (
              <p style={{ color: 'red', fontSize: '13px' }}>{emailError}</p>
            )}
          </div>
          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <p style={{ color: 'red', fontSize: '13px' }}>{passwordError}</p>
            )}
          </div>
          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {password !== confirmPassword && confirmPassword.length > 0 && (
              <span
                id="passwordError"
                className="text-red-500 text-xs"
              >
                Passwords do not match.
              </span>
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 text-white rounded ${
              isButtonEnabled
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-yellow-300 cursor-not-allowed'
            }`}
            disabled={!isButtonEnabled}
            onClick={changePassword}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Password;
