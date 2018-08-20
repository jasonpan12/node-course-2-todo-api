// Set the database environment to production, development, or test.
// Environment is set to test in package.json for 'npm test'.

var env = process.env.NODE_ENV || 'development';

if (env==='development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') { // test environment used in npm test
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
