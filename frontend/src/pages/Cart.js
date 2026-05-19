import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Cart = () => {

  const {
    cart,
    removeFromCart,
    total,
    clearCart
  } = useCart();

  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showPayment, setShowPayment] = useState(false);

  // ✅ NEW FIELDS (replacing screenshot)
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // =======================
  // CHECKOUT
  // =======================
  const handleCheckout = async () => {
    try {

      if (!accountNumber) {
        alert('Please enter UPI ID / Account Number');
        return;
      }

      const token = localStorage.getItem('token');

      const items = cart.map(item => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.qty,
        image: item.images?.[0]
      }));

      await axios.post(
        'https://kalamandala-marketplace.onrender.com/api/orders',
        {
          items,
          totalAmount: total,
          paymentMethod,
          accountNumber,
          transactionId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      clearCart();
      setMessage('✅ Order Placed Successfully');
      setShowPayment(false);

      // clear inputs
      setAccountNumber('');
      setTransactionId('');

    } catch (error) {
      console.error(error);
      setMessage('❌ Checkout Failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8 text-purple-700">
        Your Cart
      </h1>

      {/* MESSAGE */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl font-semibold">
          {message}
        </div>
      )}

      {/* EMPTY CART */}
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">
            Your cart is empty
          </h2>
        </div>
      ) : (
        <>

          {/* CART ITEMS */}
          <div className="space-y-5">

            {cart.map(item => (
              <div
                key={item._id}
                className="flex items-center gap-5 bg-white p-5 rounded-2xl shadow"
              >

                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className="w-28 h-28 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p>Qty: {item.qty}</p>
                  <p className="text-purple-700 font-bold">₹{item.price}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

          {/* TOTAL */}
          <div className="mt-8 text-2xl font-bold">
            Total: ₹{total}
          </div>

          {/* PAYMENT SECTION */}
          <div className="mt-10 p-6 bg-white rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-4">
              Payment
            </h2>

            {/* UPI OPTION */}
            <label className="block mb-3">
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {" "}UPI Payment
            </label>

            <button
              onClick={() => setShowPayment(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl"
            >
              Proceed
            </button>

            {/* PAYMENT UI */}
            {showPayment && (
              <div className="mt-6">

                {/* QR */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-4">
                    Scan & Pay
                  </h3>

                  <img
                    src="/qr.jpeg"
                    alt="QR"
                    className="w-64 mx-auto rounded-xl"
                  />
                </div>

                {/* ACCOUNT INPUT */}
                <input
                  type="text"
                  placeholder="Enter UPI ID / Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full border p-3 rounded-xl mb-4"
                />

                {/* TRANSACTION ID */}
                <input
                  type="text"
                  placeholder="Transaction ID (optional)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full border p-3 rounded-xl mb-4"
                />

                {/* CONFIRM */}
                <button
                  onClick={handleCheckout}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl w-full"
                >
                  Confirm Order
                </button>

              </div>
            )}

          </div>

        </>
      )}

    </div>
  );
};

export default Cart;