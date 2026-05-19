import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData
      );

      // SAVE TOKEN
      localStorage.setItem(
        'token',
        res.data.token
      );

      // SAVE USER
      localStorage.setItem(
        'user',
        JSON.stringify(res.data.user)
      );

      setMessage('✅ Registration Successful');

      navigate('/');

    } catch (error) {

      console.error(error);

      setMessage('❌ Registration Failed');

    }

  };

  return (

    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">

      <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">
        Register
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        >

          <option value="buyer">
            Buyer
          </option>

          <option value="seller">
            Seller
          </option>

        </select>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-semibold"
        >
          Register
        </button>

      </form>

      {message && (
        <p className="text-center mt-5 font-semibold">
          {message}
        </p>
      )}

    </div>

  );

};

export default Register;