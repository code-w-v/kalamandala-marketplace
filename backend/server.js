const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// STATIC FILES
// =====================
app.use('/uploads', express.static('uploads'));

// =====================
// ROUTES
// =====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));

// =====================
// TEST ROUTE
// =====================
app.get('/', (req, res) => {
  res.send('API working 🚀');
});

// =====================
// DB CONNECT
// =====================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kalamandala')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});