var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // mongoose to use promises as regular, vs 3rd party
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
