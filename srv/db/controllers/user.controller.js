const argon2 = require('argon2');
const User = require('../models/user.model');

function doesUserExist(username) {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (err, result) => {
      if (err) reject(err);
      resolve(!!result);
    });
  });
}

exports.register = (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: 'username and password required',
    });
  }
  doesUserExist(req.body.username)
    .then((userExists) => {
      if (userExists) {
        res.status(400).send({
          message: 'user already exists',
        });
      } else {
        argon2.hash(req.body.password)
          .then((hash) => {
            const user = new User({
              username: req.body.username,
              password: hash,
            });
            user.save()
              .then(res.redirect('/'))
              .catch((err) => {
                res.status(500).send({
                  message: err,
                });
              });
          });
      }
    });
};

exports.login = (req, res) => {
  doesUserExist(req.body.username)
    .then((userExists) => {
      if (userExists) {
        User.findOne({ username: req.body.username }, (err, user) => {
          if (err) res.status(500).send({ message: 'Error logging in' });
          else if (argon2.verify(user.password, req.body.password)) {
            req.session.username = req.body.username;
            res.redirect('/');
          } else {
            res.status(401).send({ message: 'username or password incorrect' });
          }
        });
      } else {
        res.status(401).send({ message: 'username or password incorrect' });
      }
    });
};

exports.allUsers = (req, res) => {
  User.find({}, (err, result) => {
    if (err) res.status(500).send({ message: err });
    res.json(result);
  });
};
