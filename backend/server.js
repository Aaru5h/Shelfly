import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Is On Now');
});

app.use('/api/auth', authRoutes);

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port ${port}`);
    }
});
