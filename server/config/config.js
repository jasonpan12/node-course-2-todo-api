// Set the database environment to production, development, or test.
// Environment is set to test in package.json for 'npm test'.

var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') { // if env = development OR env = test
  var config = require('./config.json');
  var envConfig = config[env]; // bracket notation to access a property with var
   Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]; // for each key in the env, set process.env[key]
    // this is how we get config variables as environment variables
  }); // returns keys as an array
}
//
// if (env==='development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') { // test environment used in npm test
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
