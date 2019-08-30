const argon2 = require('argon2');
const User = require('../models/user.model');

function userExists(username) {
  User.findOne({ username: username }, (err, result) => {
    if (err) throw err;
    else console.log(result);
  });
}

exports.register = (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: 'username and password required',
    });
  }
  userExists(req.body.username);
  // create a new user
  argon2.hash(req.body.password)
    .then((hash) => {
      const user = new User({
        username: req.body.username,
        password: hash,
      });
      user.save()
        .then(data => console.log(data))
        .catch((err) => {
          res.status(500).send({
            message: err,
          });
        });
    });
};
