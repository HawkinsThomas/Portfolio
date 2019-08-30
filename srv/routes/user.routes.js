const user = require('../db/controllers/user.controller.js');

module.exports = (app) => {
  // Create a new Note
  app.post('/register', user.register);
};
