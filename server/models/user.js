const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: [{
      type: String,
      required: true
    }]
  }]
});

// override toJSON method
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject(); // take mongoose variable and make it an Object

  return _.pick(userObject, ['_id', 'email']);
};

// methods is an instance method
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
}

// statics is model method
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    // makes the catch in server.js run, and not the "then" if no jwt exists
    return Promise.reject();
  }

  return User.findOne({ // quotes are required when there is a dot in the value
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => { // since bcrypt does not support promises, we wrap in promise

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) { // if res true
          resolve(user);
        } else {
          reject();
        }
      });

    });
  });
}

// middleware to hash password before a save
UserSchema.pre('save', function(next) {
  var user = this;

  // only encrypt password if it was modified to avoid double encrypting on 2nd update
  if (user.isModified('password')) {

    // generate hashed and salted password. Password is already verified by the time save is called
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });

  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
