import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';

import ProductDetail from './pages/ProductDetail';

import Login from './pages/Login';

import Register from './pages/Register';

import SellerDashboard from './pages/SellerDashboard';

import Cart from './pages/Cart';

import Orders from './pages/Orders';


// =======================
// SIMPLE AUTH CHECK
// =======================
const isLoggedIn = () => {

  return localStorage.getItem('token');

};


// =======================
// PROTECTED ROUTE
// =======================
const ProtectedRoute = ({ children }) => {

  return isLoggedIn()
    ? children
    : <Navigate to="/login" />;

};


function App() {

  return (

    <Router>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">

        <Navbar />

        <Routes>

          {/* =======================
              PUBLIC ROUTES
          ======================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =======================
              PROTECTED ROUTES
          ======================= */}

          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* NEW ORDERS PAGE */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

        </Routes>

      </div>

    </Router>

  );

}

export default App;