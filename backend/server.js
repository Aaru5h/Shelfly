require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoute');

const app = express();

const port = process.env.PORT || 4000;

const allowedOrigins = [
  "https://shelfly-upzi.vercel.app",
  "http://localhost:3000",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Is On Now');
});

app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes)

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port ${port}`);
    }
});

module.exports = app;
