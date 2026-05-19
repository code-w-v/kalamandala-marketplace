import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem('token');

      const res = await axios.get(
        'https://kalamandala-marketplace.onrender.com/api/orders',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading Orders...
      </div>
    );
  }

  return (

    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8 text-purple-700">
        My Orders
      </h1>

      {orders.length === 0 ? (

        <div className="bg-white p-10 rounded-xl shadow text-center">
          No orders found
        </div>

      ) : (

        <div className="space-y-8">

          {orders.map(order => (

            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg p-6"
            >

              {/* ORDER HEADER */}
              <div className="flex flex-wrap justify-between mb-6 gap-4">

                <div>

                  <h2 className="text-xl font-bold">
                    Order ID
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {order._id}
                  </p>

                </div>

                <div>

                  <p className="font-semibold">
                    Payment:
                  </p>

                  <p className="text-purple-600">
                    {order.paymentMethod}
                  </p>

                </div>

                <div>

                  <p className="font-semibold">
                    Status:
                  </p>

                  <p className="text-green-600">
                    {order.status}
                  </p>

                </div>

                <div>

                  <p className="font-semibold">
                    Total:
                  </p>

                  <p className="text-2xl font-bold text-purple-700">
                    ₹{order.totalAmount}
                  </p>

                </div>

              </div>

              {/* PRODUCTS */}
              <div className="space-y-4">

                {order.items.map((item, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-4 border rounded-xl p-4"
                  >

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">

                      <h3 className="font-bold text-lg">
                        {item.title}
                      </h3>

                      <p>
                        ₹{item.price}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              {/* DATE */}
              <div className="mt-6 text-sm text-gray-500">

                Ordered on:
                {' '}
                {new Date(order.createdAt).toLocaleString()}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default OrderHistory;