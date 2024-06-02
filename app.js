const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const app = express();

// Database configuration
const dbConfig = require('./src/config/dbConfig');
mongoose.connect(dbConfig.url, dbConfig.options)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET, // Use the session secret from .env file
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

// Routes
const indexRoutes = require('./src/routes/index');
const loginRoutes = require('./src/routes/login');

app.use('/', indexRoutes);
app.use('/login', loginRoutes);

module.exports = app;
