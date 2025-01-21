require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_CONN_STRING;

mongoose.connect(connectionString, {
  tlsAllowInvalidCertificates: true,
})
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });
