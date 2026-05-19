import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: 'dot-mandala'
  });

  const [editingId, setEditingId] = useState(null);

  const [myProducts, setMyProducts] = useState([]);

  const [message, setMessage] = useState('');

  const [uploading, setUploading] = useState(false);

  // =======================
  // PROTECT ROUTE
  // =======================
  useEffect(() => {

    const token = localStorage.getItem('token');

    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user?.role !== 'seller') {

      navigate('/login');

      return;

    }

    fetchMyProducts();

  }, [navigate]);

  // =======================
  // FETCH MY PRODUCTS
  // =======================
  const fetchMyProducts = async () => {

    try {

      const token = localStorage.getItem('token');

      const res = await axios.get(
        'http://localhost:5000/api/products/seller/my-products',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMyProducts(res.data);

    } catch (error) {

      console.error(error);

    }

  };

  // =======================
  // IMAGE UPLOAD
  // =======================
  const handleImageUpload = async (e) => {

    try {

      setUploading(true);

      const file = e.target.files[0];

      if (!file) return;

      const data = new FormData();

      data.append('image', file);

      const res = await axios.post(
        'http://localhost:5000/api/upload',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        image: res.data.imageUrl
      }));

      setMessage('✅ Image Uploaded Successfully');

    } catch (error) {

      console.error(error);

      setMessage('❌ Image Upload Failed');

    } finally {

      setUploading(false);

    }

  };

  // =======================
  // HANDLE CHANGE
  // =======================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // =======================
  // ADD / UPDATE PRODUCT
  // =======================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem('token');

      // =======================
      // UPDATE PRODUCT
      // =======================
      if (editingId) {

        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          {
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            images: [formData.image],
            category: formData.category
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMessage('✅ Product Updated Successfully');

        setEditingId(null);

      }

      // =======================
      // ADD PRODUCT
      // =======================
      else {

        await axios.post(
          'http://localhost:5000/api/products',
          {
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            images: [formData.image],
            category: formData.category
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMessage('✅ Product Added Successfully');

      }

      // RESET FORM
      setFormData({
        title: '',
        description: '',
        price: '',
        image: '',
        category: 'dot-mandala'
      });

      fetchMyProducts();

    } catch (error) {

      console.error(error);

      setMessage('❌ Operation Failed');

    }

  };

  // =======================
  // DELETE PRODUCT
  // =======================
  const handleDelete = async (id) => {

    try {

      const token = localStorage.getItem('token');

      await axios.delete(
        `https://kalamandala-marketplace.onrender.com/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('✅ Product Deleted Successfully');

      fetchMyProducts();

    } catch (error) {

      console.error(error);

      setMessage('❌ Delete Failed');

    }

  };

  return (

    <div className="max-w-6xl mx-auto py-10 px-4">

      <h1 className="text-4xl font-bold mb-8 text-center text-purple-700">
        Seller Dashboard
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 space-y-5 mb-10"
      >

        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          rows="4"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* IMAGE UPLOAD */}
        <div>

          <label className="block mb-2 font-semibold">
            Upload Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-3 rounded-lg bg-white"
          />

        </div>

        {/* UPLOADING */}
        {uploading && (

          <p className="text-blue-600 font-semibold">
            Uploading image...
          </p>

        )}

        {/* IMAGE PREVIEW */}
        {formData.image && (

          <img
            src={formData.image}
            alt="preview"
            className="w-40 h-40 object-cover rounded-xl mb-4 border"
          />

        )}

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        >

          <option value="dot-mandala">
            Dot Mandala
          </option>

          <option value="lippan-art">
            Lippan Art
          </option>

          <option value="rangoli">
            Rangoli
          </option>

          <option value="other">
            Other
          </option>

        </select>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-semibold disabled:bg-gray-400"
        >
          {editingId ? 'Update Product' : 'Add Product'}
        </button>

      </form>

      {/* MESSAGE */}
      {message && (
        <p className="text-center mb-6 text-lg font-semibold">
          {message}
        </p>
      )}

      {/* MY PRODUCTS */}
      <h2 className="text-3xl font-bold mb-6 text-purple-700">
        My Products
      </h2>

      {myProducts.length === 0 ? (

        <p>No products added yet</p>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {myProducts.map(product => (

            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >

              <img
                src={product.images?.[0]}
                alt={product.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">

                <h3 className="text-xl font-bold mb-2">
                  {product.title}
                </h3>

                <p className="text-gray-600 mb-3">
                  {product.description}
                </p>

                <p className="text-2xl font-bold text-purple-700 mb-4">
                  ₹{product.price}
                </p>

                {/* EDIT BUTTON */}
                <button
                  onClick={() => {

                    setEditingId(product._id);

                    setFormData({
                      title: product.title,
                      description: product.description,
                      price: product.price,
                      image: product.images?.[0],
                      category: product.category
                    });

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });

                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-3"
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default SellerDashboard;