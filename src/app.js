require('dotenv').config();
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const indexRoutes = require('./routes/index.routes');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'ejs');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/', indexRoutes);




module.exports = app;