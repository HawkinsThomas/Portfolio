const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const dbConfig = require('./db/config/database.config.js');

const app = express();


const { getHomePage } = require('./routes/home');
// const { getAllUsers } = require('./routes/allUsers');
const { authenticate } = require('./middleware/authentication');
// const { login } = require('./routes/login');
const userRoutes = require('./routes/user.routes.js');

const dist = path.resolve('dist');

// configure middleware
app.set('port', process.env.HTTP_PORT); // set express to use this port
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:
  {
    secure: false,
    maxAge: 7200000,
    httpOnly: true,
  },
}));

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Successfully connected to the database');    
  }).catch((err) => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });

app.use(express.static(dist));
app.use(authenticate);
// routes for the app

app.get('/', getHomePage);
userRoutes(app);

// set the app to listen on the port
app.listen(process.env.HTTP_PORT, () => {
  console.log(`Server running on port: ${process.env.HTTP_PORT}`);
});
