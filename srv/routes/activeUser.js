module.exports = {
  activeUser: (req, res) => {
    res.json(req.session.username);
  },
};
