import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './src/router/user.routes.js';
import connectToMongoDB from './src/db/connectToMongoDB.js';
import { fileURLToPath } from 'url';
import path from 'path';
import userProtectingRouter from './src/middleware/userProtectingRouter.js'
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the 'public' directory inside the 'src' directory
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(cors());
app.use(express.json()); 
app.use(cookieParser());
app.use(bodyParser.json());

// Route for the home page ("/")
app.get('/', (req, res) => {
    // Serve the login.html file
    res.sendFile(path.join(__dirname, 'src', 'public', 'login.html'));
});
app.get('/todo',(req, res) => {
   return res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
})
app.use('/api/user',router);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running in port ${PORT}`);
});
