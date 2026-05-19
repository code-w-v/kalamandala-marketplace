import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {

  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState('');

  const [message, setMessage] = useState('');

  // =======================
  // FETCH PRODUCT
  // =======================
  const fetchProduct = async () => {

    try {

      const res = await axios.get(
        `https://kalamandala-marketplace.onrender.com/api/products/${id}`
      );

      setProduct(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchProduct();

  }, [id]);

  // =======================
  // ADD REVIEW
  // =======================
  const handleReviewSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem('token');

      await axios.post(
        `https://kalamandala-marketplace.onrender.com/api/products/${id}/review`,
        {
          rating,
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('✅ Review Added');

      setComment('');

      fetchProduct();

    } catch (error) {

      console.error(error);

      setMessage('❌ Failed To Add Review');

    }

  };

  if (loading) {

    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );

  }

  if (!product) {

    return (
      <div className="text-center py-20">
        Product not found
      </div>
    );

  }

  return (

    <div className="max-w-6xl mx-auto p-6">

      {/* PRODUCT */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div>

          <img
            src={
              product.images?.[0]
                ? product.images[0]
                : 'https://via.placeholder.com/500'
            }
            alt={product.title}
            className="w-full h-[450px] object-cover rounded-2xl shadow-lg"
          />

        </div>

        {/* DETAILS */}
        <div>

          <h1 className="text-4xl font-bold mb-4">
            {product.title}
          </h1>

          <p className="text-gray-600 mb-4 text-lg">
            {product.description}
          </p>

          <p className="text-3xl font-bold text-purple-700 mb-4">
            ₹{product.price}
          </p>

          <p className="mb-2">
            <span className="font-semibold">
              Category:
            </span>{' '}
            {product.category}
          </p>

          <p className="mb-6">
            <span className="font-semibold">
              Seller:
            </span>{' '}
            {product.seller?.name || 'KalaMandala Seller'}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Add To Cart
          </button>

        </div>

      </div>

      {/* REVIEW FORM */}
      <div className="mt-14 bg-white shadow-lg rounded-2xl p-8">

        <h2 className="text-3xl font-bold mb-6 text-purple-700">
          Add Review
        </h2>

        <form
          onSubmit={handleReviewSubmit}
          className="space-y-5"
        >

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border p-3 rounded-lg"
          >

            <option value="5">
              ⭐⭐⭐⭐⭐ (5)
            </option>

            <option value="4">
              ⭐⭐⭐⭐ (4)
            </option>

            <option value="3">
              ⭐⭐⭐ (3)
            </option>

            <option value="2">
              ⭐⭐ (2)
            </option>

            <option value="1">
              ⭐ (1)
            </option>

          </select>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-3 rounded-lg"
            rows="4"
            required
          />

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Submit Review
          </button>

        </form>

        {message && (
          <p className="mt-4 font-semibold">
            {message}
          </p>
        )}

      </div>

      {/* REVIEWS */}
      <div className="mt-14">

        <h2 className="text-3xl font-bold mb-6 text-purple-700">
          Reviews
        </h2>

        {product.reviews?.length === 0 ? (

          <p>No reviews yet</p>

        ) : (

          <div className="space-y-6">

            {product.reviews.map((review, index) => (

              <div
                key={index}
                className="bg-white shadow rounded-xl p-5"
              >

                <div className="flex justify-between mb-2">

                  <h3 className="font-bold text-lg">
                    {review.name}
                  </h3>

                  <p>
                    {'⭐'.repeat(review.rating)}
                  </p>

                </div>

                <p className="text-gray-700">
                  {review.comment}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};

export default ProductDetail;