const express = require('express');


const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', require('./routes/index.routes'));


module.exports = app;