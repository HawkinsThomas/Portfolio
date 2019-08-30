const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();


const { getHomePage } = require('./routes/home');
const { getAllUsers } = require('./routes/allUsers');
const { authenticate } = require('./middleware/authentication');
const { login } = require('./routes/login');
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

app.use(express.static(dist));
app.use(authenticate);

// routes for the app

app.get('/', getHomePage);
app.get('/allUsers', getAllUsers);
app.post('/login', login);
userRoutes(app);

// set the app to listen on the port
app.listen(process.env.HTTP_PORT, () => {
  console.log(`Server running on port: ${process.env.HTTP_PORT}`);
});
