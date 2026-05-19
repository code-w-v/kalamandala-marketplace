import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Home = () => {

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState('');

  const [category, setCategory] = useState('');

  const [loading, setLoading] = useState(true);

  // =======================
  // FETCH PRODUCTS
  // =======================
  const fetchProducts = async () => {

    try {

      setLoading(true);

      const params = {
        search,
        category
      };

      const res = await axios.get(
        'https://kalamandala-marketplace.onrender.com/api/products',
        { params }
      );

      setProducts(
        Array.isArray(res.data)
          ? res.data
          : res.data.products || []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchProducts();

    // eslint-disable-next-line

  }, [search, category]);

  // =======================
  // LOADING
  // =======================
  if (loading) {

    return (

      <div className="flex justify-center py-20 text-xl font-semibold">
        Loading products...
      </div>

    );

  }

  return (

    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* SEARCH */}
      <div className="mb-10">

        <div className="relative max-w-md mx-auto">

          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search mandala arts..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">

          <button
            className={`px-5 py-2 rounded-xl transition ${
              category === 'dot-mandala'
                ? 'bg-purple-600 text-white'
                : 'bg-white border'
            }`}
            onClick={() =>
              setCategory(
                category === 'dot-mandala'
                  ? ''
                  : 'dot-mandala'
              )
            }
          >
            Dot Mandala
          </button>

          <button
            className={`px-5 py-2 rounded-xl transition ${
              category === 'lippan-art'
                ? 'bg-pink-600 text-white'
                : 'bg-white border'
            }`}
            onClick={() =>
              setCategory(
                category === 'lippan-art'
                  ? ''
                  : 'lippan-art'
              )
            }
          >
            Lippan Art
          </button>

          <button
            className={`px-5 py-2 rounded-xl transition ${
              category === 'rangoli'
                ? 'bg-orange-500 text-white'
                : 'bg-white border'
            }`}
            onClick={() =>
              setCategory(
                category === 'rangoli'
                  ? ''
                  : 'rangoli'
              )
            }
          >
            Rangoli
          </button>

        </div>

      </div>

      {/* NO PRODUCTS */}
      {products.length === 0 ? (

        <div className="text-center py-20">

          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Products Found
          </h2>

          <p className="text-gray-500">
            Try another search or category
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {products.map((product) => (

            <Link
              key={product._id}
              to={`/product/${product._id}`}
            >

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-1">

                {/* IMAGE */}
                <div className="h-64 bg-gray-100 overflow-hidden">

                  <img
                    src={
                      product.images?.[0]
                        ? product.images[0]
                        : 'https://via.placeholder.com/300'
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />

                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    {product.title}
                  </h2>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* SELLER */}
                  <p className="text-sm text-gray-500 mb-3">

                    Sold By:{' '}

                    <span className="font-semibold text-purple-700">

                      {product.seller?.name
                        ? product.seller.name
                        : 'KalaMandala Seller'}

                    </span>

                  </p>

                  {/* PRICE */}
                  <div className="flex justify-between items-center">

                    <span className="text-xl font-bold text-purple-600">
                      ₹{product.price}
                    </span>

                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      {product.category}
                    </span>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>

  );

};

export default Home;