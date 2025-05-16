const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const improveRoutes = require('./routes/improve.js');

dotenv.config();
const app = express();

const connectDB = require('./config/db');
connectDB();

app.use(cors());
app.use(express.json());

app.use('/improve', improveRoutes);

app.listen(5002, () => console.log('AI service running on port 5002'));