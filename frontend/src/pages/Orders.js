import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // =======================
  // FETCH ORDERS
  // =======================
  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem('token');

      const res = await axios.get(
        'http://localhost:5000/api/orders/my-orders',
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

  // =======================
  // LOADING
  // =======================
  if (loading) {

    return (

      <div className="text-center py-20 text-xl">
        Loading orders...
      </div>

    );

  }

  return (

    <div className="max-w-6xl mx-auto py-10 px-4">

      <h1 className="text-4xl font-bold mb-10 text-purple-700">
        My Orders
      </h1>

      {orders.length === 0 ? (

        <div className="text-center py-20">

          <h2 className="text-2xl font-bold mb-2">
            No Orders Yet
          </h2>

          <p className="text-gray-500">
            Your placed orders will appear here
          </p>

        </div>

      ) : (

        <div className="space-y-8">

          {orders.map(order => (

            <div
              key={order._id}
              className="bg-white shadow-xl rounded-2xl p-6"
            >

              {/* ORDER HEADER */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">

                <div>

                  <h2 className="text-xl font-bold">
                    Order ID:
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {order._id}
                  </p>

                </div>

                <div className="mt-4 md:mt-0 text-right">

                  <p className="font-semibold">
                    Payment:
                    {' '}
                    {order.paymentMethod}
                  </p>

                  <p className="font-bold text-purple-700 text-xl">
                    ₹{order.totalAmount}
                  </p>

                </div>

              </div>

              {/* ORDER ITEMS */}
              <div className="space-y-5">

                {order.items.map(item => (

                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-b pb-4"
                  >

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    <div className="flex-1">

                      <h3 className="font-bold text-lg">
                        {item.title}
                      </h3>

                      <p className="text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-purple-700 font-bold">
                        ₹{item.price}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              {/* ORDER DATE */}
              <div className="mt-6 text-right text-sm text-gray-500">

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

export default Orders;