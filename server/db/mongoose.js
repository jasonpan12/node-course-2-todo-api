var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // mongoose to use promises as regular, vs 3rd party
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
