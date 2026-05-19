import React from 'react';

import {
  Link,
  useNavigate
} from 'react-router-dom';


const Navbar = () => {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('user')
  );


  // =======================
  // LOGOUT
  // =======================
  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');

  };


  return (

    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* =======================
          LOGO
      ======================= */}
      <Link
        to="/"
        className="text-3xl font-extrabold text-purple-700 tracking-wide"
      >
        KalaMandala
      </Link>


      {/* =======================
          NAV LINKS
      ======================= */}
      <div className="flex items-center gap-4 flex-wrap">

        {/* HOME */}
        <Link
          to="/"
          className="hover:text-purple-600 font-medium"
        >
          Home
        </Link>


        {/* CART */}
        {user && (

          <Link
            to="/cart"
            className="hover:text-purple-600 font-medium"
          >
            Cart
          </Link>

        )}


        {/* ORDERS */}
        {user && (

          <Link
            to="/orders"
            className="hover:text-purple-600 font-medium"
          >
            My Orders
          </Link>

        )}


        {/* SELLER DASHBOARD */}
        {user?.role === 'seller' && (

          <Link
            to="/seller/dashboard"
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
          >
            Seller Dashboard
          </Link>

        )}


        {/* =======================
            USER LOGGED IN
        ======================= */}
        {user ? (

          <div className="flex items-center gap-3">

            <span className="font-semibold text-gray-700">
              Hi, {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
            >
              Logout
            </button>

          </div>

        ) : (

          /* =======================
              NOT LOGGED IN
          ======================= */
          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="border border-purple-500 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-xl transition"
            >
              Register
            </Link>

          </div>

        )}

      </div>

    </nav>

  );

};

export default Navbar;