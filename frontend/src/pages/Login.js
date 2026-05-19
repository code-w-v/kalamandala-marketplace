import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
        'http://localhost:5000/api/auth/login',
        formData
      );

      localStorage.setItem('token', res.data.token);

      localStorage.setItem(
        'user',
        JSON.stringify(res.data.user)
      );

      alert('Login Successful');

      navigate('/');

    } catch (error) {

      console.log(error);

      alert('Login Failed');

    }

  };

  return (

    <div className="flex justify-center items-center min-h-screen">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded-lg"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account?
          <Link
            to="/register"
            className="text-purple-600 ml-1"
          >
            Register
          </Link>
        </p>

      </form>

    </div>

  );

};

export default Login;