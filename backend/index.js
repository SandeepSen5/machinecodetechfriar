const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express();


const adminRouter = require('./router/adminRouter/adminroute')

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('db connected')
    })
    .catch(err => console.log(err));


app.use('/admin', adminRouter);
// app.use('/', userRouter);

app.listen(4000, () => {
    console.log('Server Started Running at 4000');
});