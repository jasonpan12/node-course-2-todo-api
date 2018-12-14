var {User} = require('./../models/user');

// middleware for express, takes 3 args always
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) =>  {
    if(!user) {
      return Promise.reject(); // sends to catch
    }
    req.user = user;
    req.token = token;
    next(); // tell express to keep going past the middleware/authenticate function
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
