const user = require('../db/controllers/user.controller.js');
const { activeUser } = require('./activeUser');

module.exports = (app) => {
  // Create a new Note
  app.post('/register', user.register);
  app.post('/login', user.login);
  app.get('/allUsers', user.allUsers);
  app.get('/activeUser', activeUser);
};
