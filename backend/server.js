import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/productRoute.js';


const app = express();

const port = 4000

app.use(cors(
    {
    origin: ["https://shelfly-upzi.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }
));

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
