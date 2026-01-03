const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const app = express();


//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Api Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/education', require('./routes/education'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

//Error Handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Server Error";
    res.status(status).json({
        success: false,
        status,
        message
    });
});

//404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not Found"
    });
});

const PORT = process.env.PORT || 5000;

const MAX_RETRIES = 5;
let attempts = 0;

async function connectWithRetry(){
    while(attempts < MAX_RETRIES){
        try {
            attempts++;
            await connectDB();
            console.log('MongoDB connected');
        } catch (error) {
            console.error(`MongoDB connection unsuccessful (attempt ${attempts} of ${MAX_RETRIES}), retrying in 5 seconds...`, error);

            if(attempts >= MAX_RETRIES){
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

connectWithRetry().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

